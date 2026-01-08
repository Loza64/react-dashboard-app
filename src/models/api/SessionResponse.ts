import type User from "./entities/User"

export default interface SessionResponse {
    token: string
    data: User
}