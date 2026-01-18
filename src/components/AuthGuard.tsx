// components/AuthGuard.tsx
import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { RouteConfig } from "@/utils/RouteConfig";

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: string; // e.g., "admin"
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("jwtAccessToken");
        const expireAt = Number(sessionStorage.getItem("expireAt"));
        const role = sessionStorage.getItem("role");

      
        if (!token) {
            router.replace(RouteConfig.SESSION_TIME_OUT);
            return;
        }

        if (requiredRole && role !== requiredRole) {
            router.push(RouteConfig.PERMISSION_DENIED)
            return;
        }

        setAuthorized(true);
    }, [router, requiredRole]);

    if (!authorized) return null; // or a loading spinner

    return <>{children}</>;
};

export default AuthGuard;
