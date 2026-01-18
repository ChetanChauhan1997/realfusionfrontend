"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/utils/RouteConfig";

interface AuthButtonProps {
    onOpenLogin: () => void; // callback to open LoginModal
}

export default function AuthButton({ onOpenLogin }: AuthButtonProps) {
    const [userDetail, setUserDetail] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            try {
                setUserDetail(JSON.parse(user));
            } catch (err) {
                console.error("Invalid user data in sessionStorage", err);
            }
        }
    }, []);

    if (userDetail) {
        // If logged in → show Documents link
        return (
            <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#40D3B6] to-[#017BFC] px-6 py-2 rounded-lg font-semibold text-white
                transition-all duration-300 hover:shadow-[0px_6px_18px_rgba(2,203,183,0.5)]"
                onClick={() => router.push(RouteConfig.DOCUMENTS)}
            >
                Reports
            </motion.button>
            </>
            
        );
    }

    // If not logged in → show Sign In
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] px-6 py-2 rounded-lg font-semibold text-white
      transition-all duration-300 hover:shadow-[0px_6px_18px_rgba(2,203,183,0.5)]"
            onClick={onOpenLogin}
        >
            Sign In
        </motion.button>
    );
}
