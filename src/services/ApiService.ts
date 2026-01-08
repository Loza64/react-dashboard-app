import axios, { AxiosHeaders, type AxiosInstance, type AxiosRequestConfig } from "axios"
import { getToken } from "./token"
import type User from "../models/api/entities/User"
import type PaginationResponse from "../models/api/Pagination"
import type SessionResponse from "@/models/api/SessionResponse"

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

        // Interceptor para agregar token automáticamente
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

    // ----------------- CRUD -----------------

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

    public async create<T>({ payload, endpoint, config }: { payload: T | FormData; endpoint?: string; config?: AxiosRequestConfig }): Promise<T> {
        const url = endpoint || this.endpoint
        const res = await this.axiosInstance.post<T>(
            url,
            payload,
            {
                ...config,
                headers: payload instanceof FormData
                    ? config?.headers
                    : { 'Content-Type': 'application/json', ...config?.headers }
            }
        )
        return res.data
    }

    public async update<T>({ id, payload, endpoint, config }: { id: number; payload: Partial<T> | FormData; endpoint?: string; config?: AxiosRequestConfig }): Promise<T> {
        const url = endpoint ? `${endpoint}/${id}` : `${this.endpoint}/${id}`
        const res = await this.axiosInstance.put<T>(
            url,
            payload,
            {
                ...config,
                headers: payload instanceof FormData
                    ? config?.headers
                    : { 'Content-Type': 'application/json', ...config?.headers }
            }
        )
        return res.data
    }

    public async delete({ id, endpoint, config }: { id: number; endpoint?: string; config?: AxiosRequestConfig }): Promise<void> {
        const url = endpoint ? `${endpoint}/${id}` : `${this.endpoint}/${id}`
        await this.axiosInstance.delete(url, config)
    }

    // ----------------- Auth -----------------

    public async login({ username, password }: { username: string; password: string }): Promise<SessionResponse> {
        const res = await this.axiosInstance.post<SessionResponse>('/auth/login', { username, password })
        return res.data
    }

    public async signUp({ payload }: { payload: User }): Promise<SessionResponse> {
        const res = await this.axiosInstance.post<SessionResponse>('/auth/signup', payload)
        return res.data
    }

    public async profile(): Promise<User> {
        const res = await this.axiosInstance.get<User>('/auth/profile')
        return res.data
    }
}
