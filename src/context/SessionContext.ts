import type SessionType from "@/models/context/SessionType";
import { createContext } from "react";

export const SessionContext = createContext<SessionType | undefined>(undefined);
