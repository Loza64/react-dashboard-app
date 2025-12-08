import { RoleName } from "src/config/roles"
import Permissions from "./Permissions"

export default interface Role {
    id?: number
    name: RoleName
    permissions?: Permissions[]
}