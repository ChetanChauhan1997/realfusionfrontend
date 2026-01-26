"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  BarChart3,
  Users,
  Brain,
  Menu,
  X,
  Home,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { IMAGES } from "../../src/utils/Images";
import { RouteConfig } from "@/utils/RouteConfig";
import AuthButton from "@/components/AuthButton";
import LogoutButton from "@/components/LogoutButton";

interface NavbarProps {
  activeSection?: string;
  onOpenLogin: () => void;
  userDetail?: any;
}

const Navbar = ({ activeSection = "hero", onOpenLogin, userDetail }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // const scrollToSection = (sectionId: string) => {
  //   if (pathname !== RouteConfig.HOME) {
  //     router.push(`${RouteConfig.HOME}#${sectionId}`);
  //   } else {
  //     const element = document.getElementById(sectionId);
  //     if (element) {
  //       element.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }
  //   setIsMobileMenuOpen(false);
  // };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);

    const doScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (pathname !== RouteConfig.HOME) {
      router.push(`${RouteConfig.HOME}#${sectionId}`);
    } else {
      // wait for mobile menu close animation
      setTimeout(doScroll, 350);
    }
  };


  const handleLogoClick = () => {
    router.push(RouteConfig.HOME);
  };

  const handleContactNavigation = () => {
    if (pathname !== RouteConfig.HOME) {
      router.push(`${RouteConfig.HOME}#contact`);
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleServiceClick = (action: () => void) => {
    action();
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: "about", label: "About Us", icon: Users },
    { id: "ai", label: "The Power of AI", icon: Brain },
    { id: "contact", label: "Contact Us", icon: Mail },
  ];

  const serviceItems = [
    {
      label: "Newsletter",
      icon: Mail,
      action: () => onOpenLogin(),
    },
    {
      label: "Property selection",
      icon: BarChart3,
      action: () => router.push("/investment-selector"),
    },
    {
      label: "Consulting services",
      icon: Users,
      action: () => handleContactNavigation(),
    },
  ];

  const handleHomeClick = () => {
    router.push(RouteConfig.HOME);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="top-0 left-0 right-0 z-50 bg-[#f7f7f7] "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Image
              src={IMAGES.APP_LOGO}
              alt="RealFusion Logo"
              width={95}
              height={95}
              className="h-[120px] w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div
              className="relative group"
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
              }}
            >
              <button className="relative px-4 py-2 text-black-800 text-semibold hover:text-slate-800 transition-all duration-300 outline-none cursor-pointer flex items-center gap-1">
                Services
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
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
                      {serviceItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleServiceClick(item.action)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative group px-4 py-2 text-black-800 text-semibold hover:text-slate-800 transition-all duration-300"
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-400
                    ${activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <AuthButton onOpenLogin={onOpenLogin} />
            {userDetail && <LogoutButton />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-slate-200 shadow-lg overflow-hidden mobile-menu"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Home Button for Mobile */}
              {/* <button
                onClick={handleHomeClick}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
              >
                <Home className="w-4 h-4" />
                Home
              </button> */}

              {/* Mobile Services Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">Services</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-8 space-y-2 overflow-hidden"
                    >
                      {serviceItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleServiceClick(item.action)}
                          className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                        >
                          <item.icon className="w-3 h-3" />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3 flex justify-center">
                <div className="px-2">
                  <AuthButton
                    onOpenLogin={() => {
                      onOpenLogin();
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </div>
                {userDetail && (
                  <div className="px-2">
                    <LogoutButton />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;