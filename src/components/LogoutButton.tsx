"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RouteConfig } from "@/utils/RouteConfig";
import api from "@/services";
import apiPaths from "@/config/ApiPath";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const pathName = router.pathname;

    const handleLogout = async () => {
        await api.post(apiPaths.LOGOUT);
        sessionStorage.clear();
        if (pathName === "/") {
            window.location.reload();
        } else {
            router.push(RouteConfig.LANDING_PAGE);
        }
    }
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg font-semibold text-white
          transition-all duration-300 hover:bg-red-600"
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
        </motion.button>
    )
}
