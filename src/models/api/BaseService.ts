import type { AxiosRequestConfig } from 'axios'
import type PaginationResponse from './Pagination';

export default abstract class BaseService<Entity> {
    abstract findAll(config?: AxiosRequestConfig, endpoint?: string): Promise<PaginationResponse<Entity>>
    abstract findById(id: number, endpoint?: string): Promise<Entity>
    abstract create(payload: Entity | FormData, endpoint?: string): Promise<Entity>
    abstract update(id: number, payload: Partial<Entity> | FormData, endpoint?: string): Promise<Entity>
    abstract delete(id: number, endpoint?: string): Promise<void>
}
