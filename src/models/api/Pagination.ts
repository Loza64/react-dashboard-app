export default interface PaginationResponse<T> {
    data: T[]
    page: number
    size: number
    pages: number
    total: number
}