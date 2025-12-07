import { useContext } from "react";
import AppType from "@/models/context/AppType";
import { ApplicationContext } from "@/context/ApplicationContext";

export const useAppContext = (): AppType => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("El proveedor de la app no ha sido inicializado");
    return context;
};
