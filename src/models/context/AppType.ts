import { Dispatch, SetStateAction } from "react"

export default interface AppType {
    search: string
    setSearch: Dispatch<SetStateAction<string>>
}