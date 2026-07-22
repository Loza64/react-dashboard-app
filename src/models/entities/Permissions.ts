export default interface Permissions {
  id?: number
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  title?: string
}
