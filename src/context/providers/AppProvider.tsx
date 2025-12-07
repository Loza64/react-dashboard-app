import AppType from "@/models/context/AppType";
import { ReactNode, useState } from "react";
import { ApplicationContext } from "../ApplicationContext";

export default function AppProvider({ children }: { children: ReactNode }) {

    const [search, setSearch] = useState<string>('')

    const value: AppType = {
        search,
        setSearch
    }

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    );
}