"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Bot, UserCheck, Mail, MapPin } from "lucide-react"
import ContactForm from "@/components/contact-form"
import Image from "next/image"
import { IMAGES } from "@/utils/Images"
import AuthButton from "@/components/AuthButton"
import LogoutButton from "@/components/LogoutButton"
import LoginModal from "@/components/LoginModal"
import { useRouter } from "next/router"
import { RouteConfig } from "@/utils/RouteConfig"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InvestmentSelectorPage() {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userDetail, setUserDetail] = useState<any>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isServicesOpen, setIsServicesOpen] = useState(false)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Flipping images array
    const flippingImages = [
        IMAGES.DUBAI_MARINA_LUXURY,
        IMAGES.DUBAI_SKYLINE_LUXURY,
        IMAGES.PALM_JUMEIRAH_LUXURY_VILLAS,
        IMAGES.DUBAI_NIGHT
    ]

    useEffect(() => {
        const user = sessionStorage.getItem("user")
        if (user) {
            try {
                setUserDetail(JSON.parse(user))
            } catch (err) {
                console.error("Invalid user data", err)
            }
        }
    }, [])

    // Image rotation logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % flippingImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [flippingImages.length])

    const handleLogoClick = () => {
        router.push(RouteConfig.HOME)
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] text-slate-800 overflow-x-hidden font-sans">
            {/* Navigation (Reused from Home) */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className=" top-0 left-0 right-0 z-50 bg-[#f7f7f7]"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3 cursor-pointer">
                            <Image src={IMAGES.APP_LOGO} alt="RealFusion Logo" width={95} height={56} onClick={handleLogoClick} style={{ height: "120px", width: "auto" }} />
                        </motion.div>

                        <div className="hidden md:flex items-center space-x-8">
                            <div className="relative group"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                    setIsServicesOpen(true);
                                }}
                                onMouseLeave={() => {
                                    closeTimeoutRef.current = setTimeout(() => {
                                        setIsServicesOpen(false);
                                    }, 200);
                                }}>
                                <button className="relative px-4 py-2 text-black-800 text-semibold hover:text-slate-800 transition-all duration-300 outline-none cursor-pointer flex items-center gap-1">
                                    Services
                                    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-400 group-hover:w-full"></span>
                                </button>

                                <AnimatePresence>
                                    {isServicesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 top-full pt-2 w-48 z-50"
                                        >
                                            <div className="bg-white rounded-md shadow-lg border border-slate-100 py-2">
                                                <button
                                                    onClick={() => { setIsServicesOpen(false); setIsModalOpen(true); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                >
                                                    Newsletter
                                                </button>
                                                <button
                                                    onClick={() => { setIsServicesOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                >
                                                    Property selection
                                                </button>
                                                {/* <button
                                                    onClick={() => { setIsServicesOpen(false); router.push(RouteConfig.QUESTIONNAIRE); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                >
                                                    Questionnaire
                                                </button> */}
                                                <button
                                                    onClick={() => {
                                                        setIsServicesOpen(false);
                                                        scrollToSection("contact");
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                >
                                                    Consulting services
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button onClick={() => router.push(RouteConfig.HOME + "#about")} className="relative group px-4 py-2 hover:text-slate-800 transition-all">
                                About Us
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all group-hover:w-full"></span>
                            </button>
                            <button onClick={() => router.push(RouteConfig.HOME + "#ai")} className="relative group px-4 py-2 hover:text-slate-800 transition-all">
                                The Power of AI
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all group-hover:w-full"></span>
                            </button>
                            <button onClick={() => scrollToSection("contact")} className="relative group px-4 py-2 hover:text-slate-800 transition-all">
                                Contact Us
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all group-hover:w-full"></span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <AuthButton onOpenLogin={() => setIsModalOpen(true)} />
                            {userDetail && <LogoutButton />}
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Header Section */}
            <section className="pt-16 pb-12 px-6 text-center">
                <div className="relative inline-block">
                    {/* Teal Circle Decor */}
                    <div className="absolute -top-6 -left-8 w-12 h-12 bg-[#40D3B6] rounded-full opacity-80" />
                    <h1 className="relative z-10 text-3xl md:text-5xl font-bold leading-tight text-slate-900">
                        With over a thousand off-plan <br />
                        properties available in Dubai. <br />
                        We help you choose!
                    </h1>
                </div>
            </section>

            {/* Main Content: Reach Out & Flipping Images */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
                            Reach out to us and get
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#017BFC]" />
                                <span className="text-lg text-slate-600">
                                    A free <strong className="text-slate-800">customized investment report</strong>, tailored to your investment goals.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#017BFC]" />
                                <span className="text-lg text-slate-600">
                                    Personalized <strong className="text-slate-800">service and support</strong> from our brokerage partners.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#017BFC]" />
                                <span className="text-lg text-slate-600">
                                    Step-by-step hands on support on your journey to <strong className="text-slate-800">finalize your purchase</strong>.
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Right Column: Flipping Images */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={flippingImages[currentImageIndex]}
                                    alt="Dubai Property"
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay Text */}
                                <div className="absolute inset-0 bg-black/30 p-6">
                                    {/* Top Left */}
                                    <div className="absolute top-6 left-6 text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight">
                                        1000+ <br /> Off-Plan Options
                                    </div>

                                    {/* Middle Right */}
                                    <div className="absolute top-1/2 right-6 -translate-y-1/2 text-right text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight">
                                        30+ <br /> Developers
                                    </div>

                                    {/* Bottom Left */}
                                    <div className="absolute bottom-6 left-6 text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight">
                                        50+ <br /> Neighbourhoods
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* How does it work? Section */}
            <section className="bg-[#f7f7f7] py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
                        How does it work?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <ClipboardList size={64} className="text-[#017BFC] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-4 text-slate-800">Your objectives</h3>
                            <p className="text-slate-600 text-sm md:text-base max-w-xs">
                                Fill out our short questionaire. This helps us to provide you with a tailored report.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <Bot size={64} className="text-[#017BFC] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-4 text-slate-800">Magic of AI</h3>
                            <p className="text-slate-600 text-sm md:text-base max-w-xs">
                                Our experts, using our proprietary models, will produce tailored suggestions for your needs.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <UserCheck size={64} className="text-[#017BFC] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-4 text-slate-800">The human touch</h3>
                            <p className="text-slate-600 text-sm md:text-base max-w-xs">
                                Our industry leading experts will guide you every step of the way in selecting and finalizing your purchase.
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 text-xl font-medium text-slate-800">
                        Want to know more, contact us today!
                    </div>
                </div>
            </section>

            {/* Contact Section (Reused) */}
            <section id="contact" className="py-20 relative bg-[#f7f7f7]">
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-4xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
                                Contact Us
                            </span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-6" />
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Ready to revolutionize your real estate investments in Dubai? Get in touch with our team of experts.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-8">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] w-12 h-12 rounded-lg flex items-center justify-center">
                                        <Mail size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-slate-800">Email</div>
                                        <div className="text-slate-600">info@realfusionanalytics.com</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] w-12 h-12 rounded-lg flex items-center justify-center">
                                        <MapPin size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-slate-800">Location</div>
                                        <div className="text-slate-600">Dubai, UAE</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer (Reused) */}
            <footer className="py-2 bg-[#f7f7f7]">
                <div className="max-w-8xl mx-auto px-6 text-center">
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
                    <div className="text-sm">
                        Disclaimer
                    </div>
                    <div className="text-xs text-slate-400">
                        This newsletter is provided for informational and educational purposes only and does not constitute financial, investment, legal, or tax advice. RealFusion Analytics is not a licensed financial advisor, broker, or investment firm. Any information, opinions, or recommendations expressed herein are general in nature and should not be relied upon for making investment decisions. Real estate markets, including Dubai, involve risks, and past performance is not indicative of future results. Readers are strongly encouraged to conduct their own independent research and consult with qualified financial, legal, and tax advisors before making any investment decisions. RealFusion Analytics assumes no liability for any loss or damage resulting from reliance on the information provided in this newsletter.
                    </div>
                </div>
            </footer>

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
