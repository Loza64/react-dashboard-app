import type User from "../api/entities/User"
import type SessionResponse from "../api/SessionResponse"

export default interface SessionType {
    token?: string
    user?: User
    login: (username: string, password: string) => Promise<SessionResponse>
    signup: (payload: User) => Promise<SessionResponse>
    saveSession: (session: SessionResponse) => void
    loadingSession: boolean
    logout: () => void
}