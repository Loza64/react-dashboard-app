import type User from "../../models/api/User"
import ApiService from "../ApiService"
import { setToken } from "../token"

export class AuthService {
    private static intance: AuthService
    private authServide = ApiService.getInstance()

    public static getInstance() {
        if (!this.intance) {
            this.intance = new AuthService()
        }

        return this.intance
    }

    constructor() {
        this.authServide = ApiService.getInstance()
    }

    public async login(username: string, password: string) {
        const response = await this.authServide.login({ username, password })
        if (response) {
            setToken(response.token)
            return response.data
        } else {
            return null
        }
    }

    public async signUp(payload: User) {
        const response = await this.authServide.signUp({ payload })
        if (response) {
            setToken(response.token)
            return response.data
        } else {
            return null
        }
    }

    public async profile() {
        const response = await this.authServide.profile()
        if (response) {
            return response
        } else {
            return null
        }
    }
}