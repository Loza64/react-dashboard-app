import type { AxiosRequestConfig } from 'axios'
import PaginationResponse from '../response/PaginationResponse'
import { BaseResponse } from '../response/BaseResponse'

interface RequestMeta {
  onUnauthorized?: () => void
  onForbidden?: () => void
}

export type ServiceConfig = AxiosRequestConfig & RequestMeta

export interface ApiServiceParams {
  endpoint?: string
  initPath?: string
  origin?: string
}

export interface FindAllParams extends RequestMeta {
  endpoint?: string
  config?: ServiceConfig
}

export interface FindByIdParams extends RequestMeta {
  id?: number
  endpoint?: string
  config?: ServiceConfig
}

export interface FindByParams extends RequestMeta {
  endpoint?: string
  path: string
  config?: ServiceConfig
}

export interface CreateParams<Entity> extends RequestMeta {
  payload: Entity | FormData
  endpoint?: string
  config?: ServiceConfig
}

export interface UpdateParams<Entity> extends RequestMeta {
  id: string | number
  payload: Partial<Entity> | FormData
  endpoint?: string
  config?: ServiceConfig
}

export interface DeleteParams extends RequestMeta {
  id: string | number
  endpoint?: string
  config?: ServiceConfig
}

export interface RestoreParams extends RequestMeta {
  id: string | number
  endpoint?: string
  config?: ServiceConfig
}

export default abstract class AbstractService<Entity> {
  abstract findAll(params?: FindAllParams): Promise<PaginationResponse<Entity>>
  abstract findById(params: FindByIdParams): Promise<BaseResponse<Entity>>
  abstract findBy(params: FindByParams): Promise<BaseResponse<Entity>>
  abstract create(params: CreateParams<Entity>): Promise<BaseResponse<Entity>>
  abstract update(params: UpdateParams<Entity>): Promise<BaseResponse<Entity>>
  abstract delete(params: DeleteParams): Promise<void>
  abstract restore(params: RestoreParams): Promise<void>
}
