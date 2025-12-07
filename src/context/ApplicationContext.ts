import AppType from "@/models/context/AppType";
import { createContext } from "react";

export const ApplicationContext = createContext<AppType | undefined>(undefined);
