import User from "./entities/User"

export default interface SessionResponse {
    token: string
    data: User
}