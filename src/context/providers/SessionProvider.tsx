import { useState, useCallback, useEffect, ReactNode } from "react";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import { SessionContext } from "../SessionContext";
import { AuthService } from "@/services/api/AuthSservice";
import User from "@/models/api/entities/User";
import errorResponse from "@/utils/errorResponse";
import { getToken, removeToken, setToken } from "@/services/token";
import SessionType from "@/models/context/SessionType";
import SessionResponse from "@/models/api/SessionResponse";

const service = AuthService.getInstance();

export default function SessionProvider({ children }: { children: ReactNode }) {

    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loadingSession, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    const login = useCallback(async (username: string, password: string) => {
        return await service.login(username, password);
    }, []);

    const signup = useCallback(async (payload: User) => {
        return await service.signUp(payload);
    }, []);

    const saveSession = useCallback(({ token, data }: SessionResponse) => {
        setUser(data)
        setToken(token)
        navigate("/dashboard")
    }, [navigate])

    const logout = useCallback(() => {
        removeToken();
        setUser(undefined);
        messageApi.info("Sesión cerrada correctamente.");
        if (location.pathname !== "/login") navigate("/login", { replace: true });
    }, [messageApi, navigate, location.pathname]);

    const loadProfile = useCallback(async () => {
        try {
            const response = await service.profile();
            if (response) setUser(response);
            else throw new Error("Perfil inválido");
        } catch (error) {
            errorResponse({ error })
            setUser(undefined);
            removeToken();
            if (location.pathname !== "/login") navigate("/login", { replace: true });
        } finally {
            setLoading(false);
        }
    }, [navigate, location.pathname]);

    useEffect(() => {
        const token = getToken();
        if (token) loadProfile();
        else {
            setLoading(false);
            if (location.pathname !== "/login") navigate("/login", { replace: true });
        }
    }, [loadProfile, location.pathname, navigate]);

    const value: SessionType = {
        user,
        login,
        signup,
        logout,
        saveSession,
        loadingSession,
    };

    if (loadingSession) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
                Cargando sesión...
            </div>
        );
    }

    return (
        <SessionContext.Provider value={value}>
            {children}
            {contextHolder}
        </SessionContext.Provider>
    );
}