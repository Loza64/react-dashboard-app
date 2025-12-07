import { useContext } from "react";
import type SessionType from "../models/context/SessionType";
import { SessionContext } from "../context/SessionContext";

export const useSession = (): SessionType => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("El proveedor de sesión no ha sido inicializado");
    return context;
};
