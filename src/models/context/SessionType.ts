import type User from "../api/User"

export default interface SessionType {
    token?: string
    user?: User
    login: (username: string, password: string) => Promise<User | null>
    signup: (payload: User) => Promise<User | null>
    loadingSession: boolean
    logout: () => void
}