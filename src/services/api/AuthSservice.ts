import type User from "../../models/api/entities/User"
import ApiService from "../ApiService"

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
        return await this.authServide.login({ username, password })
    }

    public async signUp(payload: User) {
        return await this.authServide.signUp({ payload })
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