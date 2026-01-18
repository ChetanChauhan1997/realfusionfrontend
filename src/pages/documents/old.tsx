"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";
import { IMAGES } from "@/utils/Images";
import api from "@/services";
import apiPaths from "@/config/ApiPath";
import { useToast } from "@/components/ui/toast-provider";
import AuthButton from "@/components/AuthButton";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { RouteConfig } from "@/utils/RouteConfig";
import LogoutButton from "@/components/LogoutButton";

export default function DocumentPage() {
    const router=useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero")
    const itemsPerPage = 5;
    const toast = useToast();
    const [userDetail, setUserDetail] = useState<any>(null);

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

    // Fetch documents from API
    const fetchDocuments = async () => {
        try {
            const res = await api.get(apiPaths.GET_DOCUMENTS);
            const docs = res.data.documents || [];
            console.log(docs);

            setDocuments(docs);
            setTotalPages(Math.ceil(docs.length / itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const paginatedDocs = documents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDownload = async (url: string, docId: string) => {
        const user: any = sessionStorage.getItem('user');
        const userDetail = JSON.parse(user);
        try {

            console.log(api.get('downloads'));
            const response = await api.get(`/documents/${docId}/download`, {
                params: {
                    id: userDetail?.id,
                }
            });
            const payload = response?.data;
            if (payload?.success) {
                const link = document.createElement("a");
                link.href = url;
                link.download = url.split("/").pop() || "file.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast("warning", "Something went wrong");
            }
        } catch (error: any) {
            if (error.response) {
                toast("error", error.response.data?.message || "Something went wrong");
            } else {
                toast("error", error.message || "Something went wrong");
            }
        }




    };



    useEffect(() => {
        const handleScroll = () => {
            const sections = ["hero", "about", "ai", "contact"]
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])



    const handleLogoClick=()=>{
        router.push(RouteConfig.HOME);
    }

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }



    return (
        <div className="min-h-screen bg-[#f7f7f7] text-slate-800 overflow-x-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className=" top-0 left-0 right-0 z-50 bg-[#f7f7f7]"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                            <Image src={IMAGES.APP_LOGO} alt="RealFusion Logo"
                                height={56} // same as h-14 (14 * 4px = 56px)
                                width={200}
                                onClick={handleLogoClick}
                            />
                        </motion.div>

                        <div className="flex gap-2">
                            <AuthButton onOpenLogin={() => { setIsModalOpen(true) }} />
                            {userDetail && (
                                <LogoutButton />
                            )}
                        </div>

                    </div>
                </div>
            </motion.nav>


            {/* Document Table */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-6">Uploaded Documents</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-[#f0f4f8]">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-slate-700">#</th>
                                <th className="text-left py-3 px-4 font-medium text-slate-700">Document Name</th>
                                <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                                <th className="text-center py-3 px-4 font-medium text-slate-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDocs.map((doc, idx) => (
                                <tr key={doc.id} className="border-t border-slate-200 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td className="py-3 px-4">{doc.title}</td>
                                    <td className="py-3 px-4">
                                        {/* {new Date(doc.uploadedAt).toLocaleString()} */}
                                        {doc.description}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleDownload(doc.file_path, doc.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition"
            >
              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                  {doc.title || "Untitled Document"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {doc.description || "No description available."}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {doc.uploadedAt
                    ? new Date(doc.uploadedAt).toLocaleDateString()
                    : "—"}
                </span>
                <button
                  onClick={() => handleDownload(doc.file_path, doc.id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  {/* <Download size={16} /> */}
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>

            {/* Footer */}
            <footer className="py-12  bg-[#f7f7f7]">
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
                            Revolutionizing real estate investment in Dubai through the perfect fusion of AI technology and human
                            expertise.
                        </p>
                    </motion.div>

                    <div className="text-slate-400 text-sm">© 2025 RealFusion. All rights reserved.</div>
                </div>
            </footer>

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
