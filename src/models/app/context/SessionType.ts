import User from '@/models/entities/User'
import SessionResponse from '@/sdk/model/response/SessionResponse'

export default interface SessionType {
  profile?: User
  login: (payload: {
    username: string
    password: string
    onUnauthorized?: () => void
  }) => Promise<SessionResponse>
  signup: (payload: User) => Promise<SessionResponse>
  saveSession: (session: SessionResponse) => void
  logout: () => Promise<void>
  loading: {
    profile: boolean
    login: boolean
    signup: boolean
  }
}
