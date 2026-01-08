import type { AxiosRequestConfig } from 'axios'
import ApiService from '../ApiService'
import BaseService from '@/models/api/BaseService'
import type PaginationResponse from '@/models/api/Pagination'
import type User from '@/models/api/entities/User'

type Entity = User

class UserService implements BaseService<Entity> {
    private static instance: UserService
    private api = ApiService.getInstance('/users')

    private constructor() { }

    public static getInstance(): UserService {
        if (!this.instance) {
            this.instance = new UserService()
        }
        return this.instance
    }

    public async findAll(config?: AxiosRequestConfig, endpoint?: string): Promise<PaginationResponse<Entity>> {
        return this.api.findAll<Entity>({ config, endpoint })
    }

    public async findById(id: number, endpoint?: string): Promise<Entity> {
        return this.api.findById<Entity>({ id, endpoint })
    }

    public async create(payload: Entity | FormData, endpoint?: string): Promise<Entity> {
        return this.api.create<Entity>({ payload, endpoint })
    }

    public async update(id: number, payload: Partial<Entity> | FormData, endpoint?: string): Promise<Entity> {
        return this.api.update<Entity>({ id, payload, endpoint })
    }

    public async delete(id: number, endpoint?: string): Promise<void> {
        return this.api.delete({ id, endpoint })
    }
}

const userService = UserService.getInstance()
export default userService;