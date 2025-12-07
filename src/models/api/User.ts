import type Role from "./Role"

export default interface User {
    id?: number
    username: string
    name: string
    surname: string
    email: string
    password: string
    role?: Role
}