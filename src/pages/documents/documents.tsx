"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";
import { IMAGES } from "@/utils/Images";
import api from "@/services";
import apiPaths from "@/config/ApiPath";
import { useToast } from "@/components/ui/toast-provider";
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/router";
import { RouteConfig } from "@/utils/RouteConfig";
import LogoutButton from "@/components/LogoutButton";
import { Download } from "lucide-react";

export default function DocumentPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const toast = useToast();
  const loaderRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch documents (paginated)
  const fetchDocuments = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const res = await api.get(apiPaths.GET_DOCUMENTS, {
        params: { page: pageNumber, limit: 6 }, // backend should support pagination
      });

      const docs = res.data.documents || [];
      if (docs.length === 0) {
        setHasMore(false);
      } else {
        setDocuments((prev) => [...prev, ...docs]);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast("error", "Failed to fetch documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, isLoading]);

  const handleDownload = async (url: string, docId: string) => {
    const user: any = sessionStorage.getItem("user");
    const userDetail = JSON.parse(user);
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        params: { id: userDetail?.id },
      });
      const payload = response?.data;
      if (payload?.success) {
        const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`;

        const response = await fetch(fileUrl);
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileUrl.split("/").pop() || "file.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        toast("success", "Download successful");
      } else {
        toast("warning", "Something went wrong");
      }


    } catch (error: any) {
      toast(
        "error",
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const handleLogoClick = () => {
    router.push(RouteConfig.HOME);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-slate-800 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="top-0 left-0 right-0 z-50 bg-[#f7f7f7]"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <Image
                src={IMAGES.APP_LOGO}
                alt="RealFusion Logo"
                width={95}
                height={56}
                onClick={handleLogoClick}
                className="cursor-pointer"
              />
            </motion.div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#40D3B6] to-[#017BFC] px-6 py-2 rounded-lg font-semibold text-white
                transition-all duration-300 hover:shadow-[0px_6px_18px_rgba(2,203,183,0.5)]"
                onClick={() => { router.push(RouteConfig.LANDING_PAGE) }}
              >
                <span>Back To Home</span>
              </motion.button>
              {userDetail && <LogoutButton />}

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Document List */}
      <section className="max-w-6xl mx-auto px-6 py-12">


        <div className="overflow-x-auto">
          {documents.map((doc, idx) => (
            <div key={doc.id || idx}>
              <div>
                <h2>{doc.description}</h2>
              </div>
              <div className="text-end my-2">
                <button
                  onClick={() => handleDownload(doc.file_path, doc.id)}
                  className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] px-2 py-1 rounded-lg font-semibold text-white
              transition-all duration-300
    hover:shadow-[0px_6px_18px_rgba(2,203,183,0.5)]"
                >
                  Download
                </button>
              </div>
              <hr className="mt-2 mb-2" />
            </div>
          ))}
        </div>

        {/* Loader */}
        {isLoading && (
          <p className="text-center mt-6 text-gray-500 animate-pulse">
            Loading...
          </p>
        )}
        <div ref={loaderRef} className="h-10"></div>
        {/* {!hasMore && (
          <p className="text-center text-gray-400 mt-6">
            No more documents to load
          </p>
        )} */}
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#f7f7f7]">
        <div className="max-w-6xl mx-auto px-6 text-center bg-[#f7f7f7]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent mb-4">
              RealFusion
            </div>
            <p className="text-[#5E807F] max-w-2xl mx-auto">
              Revolutionizing real estate investment in Dubai through the
              perfect fusion of AI technology and human expertise.
            </p>
          </motion.div>
          <div className="text-slate-400 text-sm">
            © 2025 RealFusion. All rights reserved.
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
