import axios, { AxiosHeaders, type AxiosInstance, type AxiosRequestConfig } from "axios"
import { getToken } from "./token"
import type User from "../models/api/User"
import type PaginationResponse from "../models/Pagination"

export default class ApiService {

    private static instances: Map<string, ApiService> = new Map()
    private axiosInstance: AxiosInstance
    private readonly baseURL = '/api'
    private endpoint: string

    private constructor(endpoint: string) {
        this.endpoint = endpoint

        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: { 'Content-Type': 'application/json' },
        })

        this.axiosInstance.interceptors.request.use((config) => {
            const token = getToken()
            if (token) {
                config.headers = new AxiosHeaders(config.headers).set('Authorization', `Bearer ${token}`)
            }
            return config
        })
    }

    public static getInstance(endpoint: string = ""): ApiService {
        if (!this.instances.has(endpoint)) {
            this.instances.set(endpoint, new ApiService(endpoint))
        }
        return this.instances.get(endpoint)!
    }

    public async findAll<T>({ endpoint, config }: { endpoint?: string, config?: AxiosRequestConfig } = {}): Promise<PaginationResponse<T>> {
        const url = endpoint || this.endpoint
        const res = await this.axiosInstance.get<PaginationResponse<T>>(url, config)
        return res.data
    }

    public async findById<T>({ id, endpoint }: { id: number; endpoint?: string }): Promise<T> {
        const url = endpoint ? `${endpoint}/${id}` : `${this.endpoint}/${id}`
        const res = await this.axiosInstance.get<T>(url)
        return res.data
    }

    public async create<T>({ payload, endpoint }: { payload: T; endpoint?: string }): Promise<T> {
        const url = endpoint || this.endpoint
        const res = await this.axiosInstance.post<T>(url, payload)
        return res.data
    }

    public async update<T>({ id, payload, endpoint }: { id: number; payload: Partial<T>; endpoint?: string }): Promise<T> {
        const url = endpoint ? `${endpoint}/${id}` : `${this.endpoint}/${id}`
        const res = await this.axiosInstance.put<T>(url, payload)
        return res.data
    }

    public async delete({ id, endpoint }: { id: number; endpoint?: string }): Promise<void> {
        const url = endpoint ? `${endpoint}/${id}` : `${this.endpoint}/${id}`
        await this.axiosInstance.delete(url)
    }

    public async login({ username, password }: { username: string; password: string }): Promise<{ token: string; data: User }> {
        const res = await this.axiosInstance.post<{ token: string; data: User }>('/auth/login', { username, password })
        return res.data
    }

    public async signUp({ payload }: { payload: User }): Promise<{ token: string; data: User }> {
        const res = await this.axiosInstance.post<{ token: string; data: User }>('/auth/signup', payload)
        return res.data
    }

    public async profile(): Promise<User> {
        const res = await this.axiosInstance.get<User>('/auth/profile')
        return res.data
    }
}