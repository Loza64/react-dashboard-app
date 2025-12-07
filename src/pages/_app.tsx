import SessionProvider from "@/context/providers/SessionProvider";
import AppOutlet from "src/views/AppOutlet";

export default function AppLayout() {
    return (
        <SessionProvider>
            <AppOutlet />
        </SessionProvider>
    )
}
