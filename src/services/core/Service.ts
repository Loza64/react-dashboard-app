import AbstractService, {
  ApiServiceParams,
  CreateParams,
  DeleteParams,
  FindAllParams,
  FindByIdParams,
  FindBy,
  UpdateParams,
  ServiceConfig,
  RestoreParams,
} from '@/models/api/core/AbstractService'
import BaseEntity from '@/models/api/core/_BaseEntity'
import { type AxiosInstance } from 'axios'
import { axiosInstance } from '../utils/axiosInstance'
import PaginationResponse from '@/models/api/core/PaginationResponse'
import { BaseResponse } from '@/models/api/core/BaseResponse'
import { appSettings } from '@/AppSettings'

export default class Service<Entity extends BaseEntity> implements AbstractService<Entity> {
  protected readonly axios: AxiosInstance
  protected readonly endpoint: string

  constructor({ origin = appSettings.apiService, initPath = 'api', endpoint = '' }: ApiServiceParams) {
    if (!origin) throw new Error('Origin is required for ApiService instance')
    this.endpoint = endpoint
    this.axios = axiosInstance({ origin, initPath })
  }

  private getUrl(endpoint?: string, idOrPath?: string | number): string {
    const base = endpoint || this.endpoint
    if (idOrPath == null) return base
    const normalized = String(idOrPath).replace(/^\/+/, '')
    return `${base}/${normalized}`
  }

  private withMeta(config?: ServiceConfig) {
    return {
      ...config,
      onUnauthorized: config?.onUnauthorized,
      onForbidden: config?.onForbidden,
    }
  }

  async findAll(params: FindAllParams): Promise<PaginationResponse<Entity>> {
    const res = await this.axios.get(
      this.getUrl(params.endpoint),
      this.withMeta(params.config)
    )
    return res.data
  }

  async findById(params: FindByIdParams): Promise<BaseResponse<Entity>> {
    const res = await this.axios.get(
      this.getUrl(params.endpoint, params.id),
      this.withMeta(params.config)
    )
    return res.data
  }

  async findBy(params: FindBy): Promise<BaseResponse<Entity>> {
    const response = await this.axios.get<BaseResponse<Entity>>(
      this.getUrl(params.endpoint, params.path),
      this.withMeta(params.config)
    )
    return response.data
  }

  async create(params: CreateParams<Entity>): Promise<BaseResponse<Entity>> {
    const res = await this.axios.post(
      this.getUrl(params.endpoint),
      params.payload,
      this.withMeta(params.config)
    )
    return res.data
  }

  async update(params: UpdateParams<Entity>): Promise<BaseResponse<Entity>> {
    const res = await this.axios.put(
      this.getUrl(params.endpoint, params.id),
      params.payload,
      this.withMeta(params.config)
    )
    return res.data
  }

  async delete(params: DeleteParams): Promise<void> {
    await this.axios.delete(
      this.getUrl(params.endpoint, params.id),
      this.withMeta(params.config)
    )
  }

  async restore(params: RestoreParams): Promise<void> {
    await this.axios.delete(
      this.getUrl(params.endpoint, `${params.id}/restore`),
      this.withMeta(params.config)
    )
  }
}
