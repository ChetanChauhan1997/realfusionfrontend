"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  Users,
  Brain,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import ContactForm from "@/components/contact-form";
import { AnimatedCounter } from "@/components/animated-counter";
import { TypeAnimation } from "react-type-animation";
import LoginModal from "@/components/LoginModal";
import Image from "next/image";
import { IMAGES } from "../../src/utils/Images";
import AuthButton from "@/components/AuthButton";
import LogoutButton from "@/components/LogoutButton";
import ContactUsForm from "@/components/home/contactus";
import { RouteConfig } from "@/utils/RouteConfig";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function RealFusionPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // const { scrollYProgress } = useScroll()

  const images = [
    // IMAGES.DUBAI_NIGHT,
    // IMAGES.DUBAI_MARINA_LUXURY,
    // IMAGES.DUBAI_SKYLINE_LUXURY,
    // IMAGES.PALM_JUMEIRAH_LUXURY_VILLAS,
    IMAGES.PEXEL1,
    IMAGES.PEXEL2,
    IMAGES.PEXEL3,
    IMAGES.PEXEL4,
    IMAGES.PEXEL5,
    IMAGES.PEXEL6,
    IMAGES.PEXEL7,
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "ai", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4s
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const lines = [
    "Data-Driven Decisions, Personalized Guidance",
    "AI Precision Meets Dubai Experts",
    "Discover Luxury & Innovation",
    "Redefining Real Estate Intelligence",
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      icon: BarChart3,
      title: "Advanced Insights",
      description:
        "Our proprietary machine learning models analyze hundreds of market signals to accurately predict investment performance. This data-driven intelligence gives you the clarity to make confident, high-return property decisions.",
    },
    {
      icon: Brain,
      title: "Interactive Selection",
      description:
        "Get personalized property recommendations tailored to your goals, powered by our AI models and vast market data. We pinpoint what's best for you and answer every question along the way.",
    },
    {
      icon: Users,
      title: "Expert Human Guidance",
      description:
        "Our network of leading agents and developers ensures every step of your investment journey is handled with precision and care. From viewings to negotiations, we provide the human expertise AI alone can't deliver.",
    },
  ];
  const handleLogoClick = () => {
    router.push(RouteConfig.HOME);
  };
  const handleContactNavigation = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      setTimeout(() => scrollToSection("contact"), 100);
    } else {
      router.push(RouteConfig.HOME + "#contact");
    }
  };




  return (
    <div className="min-h-screen bg-[#f7f7f7]   text-slate-800 overflow-x-hidden">
      {/* Navigation */}
       <Navbar 
        activeSection={activeSection}
        onOpenLogin={() => setIsModalOpen(true)}
        userDetail={userDetail}
      />

      {/*Hero   */}
      <section
        id="hero"
        className="relative min-h-[50vh] flex flex-col items-center justify-between overflow-hidden pt-10 md:pt-16 "
      >
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl mb-6 leading-snug font-semibold bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
            Best in Class Real Estate <br className="hidden sm:block" />
            Investment Insights <br className="hidden sm:block" />
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-black mt-2">
              with a Human Touch
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg text-[#2F4F6F] mb-6 max-w-3xl mx-auto leading-relaxed">
            RealFusion Analytics brings you AI-powered insights and expert local
            guidance to uncover Dubai&apos;s most lucrative real estate
            opportunities—helping investors make smarter, more confident
            decisions.
          </p>

          {/* CTA & Tagline */}
        </div>

        {/* Chevron + Image */}
        {/* <div className="relative z-10 flex flex-col items-center space-y-6 pt-8">
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-600 hover:text-black transition-colors duration-300"
          >
            <ChevronDown size={28} />
          </button>
        </div> */}
      </section>

      <section className="relative mb-12">
        {/* Background Image Wrapper */}
        <div className="h-[140vh] w-full overflow-hidden">
          <Image
            src={IMAGES.PALM}
            alt="Dubai Skyline"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Overlay with animated text */}
        <div className="absolute inset-0 flex flex-col justify-between bg-black/40">
          {/* Animated Lines */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white w-full max-w-5xl px-6">
              <ul className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold space-y-6">
                {lines.map((text, index) => (
                  <motion.li
                    key={index}
                    className={`relative py-10 ${index % 2 === 0
                      ? "text-left pr-10"
                      : "text-right pl-10 ml-auto"
                      }`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    {text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sign Up + Smarter Investments (moved to 3/4 bottom) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <AuthButton
              onOpenLogin={() => {
                setIsModalOpen(true);
              }}
            />

            <div className="text-center sm:text-left">
              <div className="text-base sm:text-lg md:text-xl font-bold text-white">
                Smarter Investments.
              </div>
              <div className="text-xs sm:text-sm md:text-base text-[#D0E6E4]">
                Humanly Delivered.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py- relative">
        <div className="absolute inset-0 bg-[#f7f7f7]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
                About Us
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-slate-600 leading-relaxed mb-6 text-justify">
                At RealFusion Analytics, we redefine Dubai real estate investing
                by fusing advanced AI with trusted human expertise.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6 text-justify">
                Our proprietary machine learning models crunch hundreds of
                market variables for unmatched insights.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed text-justify">
                Paired with our network of top-tier brokers, we deliver an
                end-to-end investment experience with a personal touch.
              </p>
              <ul className="space-y-4 text-lg text-slate-600 leading-relaxed text-justify mt-6">
                <li className="flex items-start">
                  <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span>
                    <strong className="font-semibold text-slate-800">
                      Stay Informed:
                    </strong>{" "}
                    Get our free quarterly newsletter and industry reports to
                    track the latest trends in this dynamic market.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span>
                    <strong className="font-semibold text-slate-800">
                      Personalized Picks:
                    </strong>{" "}
                    Ditch vague advice. Our free property selection service
                    offers tailored suggestions based on your goals.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span>
                    <strong className="font-semibold text-slate-800">
                      Custom Solutions:
                    </strong>{" "}
                    Need more? We provide bespoke consulting, including tailored
                    reports, portfolio management, and risk assessments.
                  </span>
                </li>
              </ul>

              <p className="text-lg mt-6 text-slate-600 leading-relaxed text-justify">
                Smarter Investments. Humanly Delivered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-full"
            >
              <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i === index ? 1 : 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Image
                      src={img}
                      alt={`Dubai ${i}`}
                      fill
                      className="object-cover rounded-2xl"
                      priority={i === 0}
                    />
                  </motion.div>
                ))}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />

                {/* Stats overlay */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-8 rounded-b-2xl border-slate-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter to={500} suffix="+" />
                      </div>
                      <div className="text-white">Properties Analyzed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter to={95} suffix="%" />
                      </div>
                      <div className="text-white">Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">24/7</div>
                      <div className="text-white">Market Monitoring</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter to={100} suffix="+" />
                      </div>
                      <div className="text-white">Happy Clients</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="ai" className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 bg-[#f7f7f7]"
          id="AI"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent">
            The Fusion of AI and Human Wisdom
          </h3>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto">
            We pair advanced machine learning models with Dubai's top real
            estate experts to uncover precise investment opportunities and
            deliver tailored, hands-on guidance.
          </p>
        </motion.div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="group [perspective:1000px] flex justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`relative w-full max-w-sm transition-all duration-700 [transform-style:preserve-3d]
                          ${isHovered
                      ? "h-[420px] scale-105 [transform:rotateY(180deg)]"
                      : "h-[200px] scale-100"
                    }
                        `}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 bg-[#F7F7F7] backdrop-blur-sm p-8 rounded-2xl border border-slate-200 group-hover:border-slate-300 shadow-md group-hover:shadow-xl transition-all duration-500 [backface-visibility:hidden] flex flex-col items-center">
                    {/* Icon - never shrinks */}
                    <div className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-none">
                      <Icon className="text-white w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-2xl font-bold transition-colors duration-500 text-center
                        ${isHovered ? "text-blue-600" : "text-slate-800"}`}
                    >
                      {card.title}
                    </h3>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] text-white px-5 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center">
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      {card.title}
                    </h3>
                    {isHovered && (
                      <TypeAnimation
                        sequence={[card.description, 0]}
                        wrapper="p"
                        cursor={true}
                        speed={90}
                        className="text-sm sm:text-base md:text-lg leading-relaxed"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="py-20 relative ">
        <div className="absolute inset-0 bg-[#f7f7f7]" />

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
              Ready to revolutionize your real estate investments in Dubai? Get in touch with our team of experts and
              discover how RealFusion Analytics can help you make smarter, more profitable investment decisions.
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
                    <div className="text-lg font-semibold text-slate-800">
                      Email
                    </div>
                    <div className="text-slate-600">info@realfusionanalytics.com</div>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-4 d-none">
                  <div className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-800">Phone</div>
                    <div className="text-slate-600">+971 4 XXX XXXX</div>
                  </div>
                </div> */}

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] w-12 h-12 rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-800">
                      Location
                    </div>
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

      {/* Footer */}
      <Footer/>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
