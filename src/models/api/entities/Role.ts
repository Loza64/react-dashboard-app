import { RoleName } from "src/config/roles"
import type Permissions from "./Permissions"

export default interface Role {
    id?: number
    name: RoleName
    permissions?: Permissions[]
}