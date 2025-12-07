import type Error from "@/models/api/Error";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function errorResponse(error: unknown): void {
    let status = 500;
    let message = "Ocurrió un error desconocido";

    if (error && typeof error === "object" && "isAxiosError" in error && (error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError<Partial<Error>>;

        if (axiosError.response?.data) {
            const data = axiosError.response.data;
            status = data.status ?? 500;
            message = data.message ?? message;
        }
        else if (axiosError.request) {
            status = 0;
            message = "No se pudo conectar con el servidor";
        }
        else {
            message = axiosError.message ?? message;
        }
    }
    // Si es un Error nativo de JS
    else if (error instanceof Error) {
        message = error.message ?? message;
    }

    toast.error(`${status}: ${message}`);
}
