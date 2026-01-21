"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { IMAGES } from "@/utils/Images";
import { RouteConfig } from "@/utils/RouteConfig";
import api from "@/services";
import apiPaths from "@/config/ApiPath";
import { useToast } from "@/components/ui/toast-provider";
import {
  Send,
  CheckCircle,
  Smartphone,
  Home,
  DollarSign,
  Calendar,
  MapPin,
  Briefcase,
  Key,
} from "lucide-react";

export default function QuestionnairePage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "", // Explicitly added to state
    goals: [] as string[],
    other_goal: "",
    holding_period: "",
    budget: "",
    property_type: [] as string[],
    bedrooms: [] as string[],
    locations: "",
    amenities: "",
    developers: "",
    timeline: "",
    concerns: "",
    comments: "",
  });

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = (prev as any)[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...current, value] };
      } else {
        return {
          ...prev,
          [field]: current.filter((item: string) => item !== value),
        };
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    //     const messageBody = `
    // Property Investment Questionnaire Submission

    // Full Name: ${formData.full_name}
    // Email: ${formData.email}

    // Investment Goals: ${formData.goals.join(", ")}
    // Other Goal: ${formData.other_goal}

    // Expected Holding Period: ${formData.holding_period}

    // Total Budget: ${formData.budget}

    // Preferred Property Type: ${formData.property_type.join(", ")}

    // Number of Bedrooms Required: ${formData.bedrooms.join(", ")}

    // Preferred Locations: ${formData.locations}

    // Must-have Amenities: ${formData.amenities}

    // Preferred Developers: ${formData.developers}

    // Purchase Timeline: ${formData.timeline}

    // Specific Concerns: ${formData.concerns}

    // Other Comments: ${formData.comments}
    //         `.trim();

    try {
      //       const payload = {
      //         name: formData.full_name,
      //         email: formData.email,
      //         message: messageBody,
      //       };
      const payload = {
        ...formData,
      };
      const response = await api.post(
        apiPaths.STORE_INVESTMENT_PROFILE,
        payload
      );

      if (response?.data?.success) {
        setIsSuccess(true);
        toast("success", "Questionnaire submitted successfully!");
      } else {
        toast("warning", "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast("error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectionCard = ({
    type = "checkbox",
    name,
    value,
    checked,
    onChange,
    label,
    icon: Icon,
  }: any) => (
    <label
      className={`
                relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 group
                ${checked
          ? "border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]"
          : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm"
        }
            `}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      {Icon && (
        <div
          className={`mr-4 p-2 rounded-lg transition-colors ${checked
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-50 text-slate-400 group-hover:text-slate-600"
            }`}
        >
          <Icon size={20} />
        </div>
      )}
      <div className="flex-grow">
        <span
          className={`font-medium transition-colors ${checked ? "text-blue-900" : "text-slate-600"
            }`}
        >
          {label}
        </span>
      </div>
      <div
        className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${checked ? "border-blue-500 bg-blue-500" : "border-slate-300"}
            `}
      >
        {checked && <CheckCircle size={12} className="text-white" />}
      </div>
    </label>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-400" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </motion.div>

            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">
                Great Success!
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Your investment profile has been received. Our expert analysts
                will review your preferences and curate a bespoke portfolio for
                you shortly.
              </p>
            </div>

            <button
              onClick={() => router.push(RouteConfig.HOME)}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Return Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 bg-[url('/grid.svg')]">
      {/* Minimal Navbar */}
      <nav className="bg-[#f8fafc] backdrop-blur-md  top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div
            className="cursor-pointer inline-block transition-transform hover:scale-105"
            onClick={() => router.push(RouteConfig.HOME)}
          >
            <Image
              src={IMAGES.APP_LOGO}
              alt="RealFusion Logo"
              width={95}
              height={56}
            />
          </div>
        </div>
      </nav>

      <div className="container max-w-4xl mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100">
            Confidential Assessment
          </span>
          <h1 className="text-2xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] bg-clip-text text-transparent pb-1">
            RealFusion Analytics Property Investment Questionnaire
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Thank you for your interest in our property investment advisory
            service. To provide personalized recommendations, please complete
            the following questionnaire. Your responses will help us tailor
            investment advice to your needs, budget, and goals.{" "}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <span className="font-bold">1</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Personal Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Goals & Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <span className="font-bold">2</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Strategy & Goals
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Primary Investment Goals
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { val: "Price Appreciation", icon: DollarSign },
                    { val: "Short Term Rental", icon: Key },
                    { val: "Long Term Rental", icon: Home },
                    { val: "Personal Use", icon: CheckCircle },
                    { val: "Diversification", icon: Briefcase },
                  ].map((item) => (
                    <SelectionCard
                      key={item.val}
                      type="checkbox"
                      name="goals"
                      value={item.val}
                      icon={item.icon}
                      label={item.val}
                      checked={formData.goals.includes(item.val)}
                      onChange={(e: any) => handleCheckboxChange(e, "goals")}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Expected Holding Period
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["1-3 years", "3-5 years", "5+ years"].map((period) => (
                    <SelectionCard
                      key={period}
                      type="radio"
                      name="holding_period"
                      value={period}
                      label={period}
                      checked={formData.holding_period === period}
                      onChange={handleRadioChange}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Investment Budget
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    AED
                  </span>
                  <input
                    type="text"
                    name="budget"
                    placeholder="1,500,000"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full pl-16 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                <span className="font-bold">3</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Property Preferences
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Property Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Studio", "Apartment", "Villa", "Penthouse"].map((type) => (
                    <SelectionCard
                      key={type}
                      type="checkbox"
                      name="property_type"
                      value={type}
                      label={type}
                      checked={formData.property_type.includes(type)}
                      onChange={(e: any) =>
                        handleCheckboxChange(e, "property_type")
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Bedrooms
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Studio", "1", "2", "3-4", "5+"].map((num) => (
                    <label
                      key={num}
                      className={`
                                            cursor-pointer w-14 h-14 rounded-xl flex items-center justify-center font-bold border-2 transition-all
                                            ${formData.bedrooms.includes(num)
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-white"
                        }
                                        `}
                    >
                      <input
                        type="checkbox"
                        value={num}
                        checked={formData.bedrooms.includes(num)}
                        onChange={(e) => handleCheckboxChange(e, "bedrooms")}
                        className="hidden"
                      />
                      {num}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    label: "Preferred Locations",
                    name: "locations",
                    ph: "e.g. Dubai Marina, Downtown...",
                  },
                  {
                    label: "Must-have Amenities",
                    name: "amenities",
                    ph: "e.g. Pool, Gym, Sea View...",
                  },
                  {
                    label: "Preferred Developers",
                    name: "developers",
                    ph: "e.g. Emaar, Damac...",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "locations" ? "md:col-span-2" : ""
                    }
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                      {field.label}
                    </label>
                    <textarea
                      name={field.name}
                      rows={field.name === "locations" ? 2 : 3}
                      placeholder={field.ph}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section 4: Timeline & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <span className="font-bold">4</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Timeline & Final Details
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Purchase Timeline
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["ASAP", "Within 3 months", "6-12 months", "1+ year"].map(
                    (time) => (
                      <SelectionCard
                        key={time}
                        type="radio"
                        name="timeline"
                        value={time}
                        label={time}
                        checked={formData.timeline === time}
                        onChange={handleRadioChange}
                      />
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  rows={4}
                  placeholder="Any specific requirements regarding ROI, payment plans, or location quirks?"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="pt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#017BFC] to-[#40D3B6] text-white py-5 px-16 rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Submit Investment Profile"}
            </motion.button>
            <p className="mt-4 text-slate-400 text-sm">
              Your information is encrypted and treated with strict
              confidentiality.
            </p>
          </motion.div>
        </form>
      </div>

      {/* Footer Reuse */}
      <footer className="py-12 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
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
            <p className="text-slate-500 max-w-2xl mx-auto">
              Revolutionizing real estate investment in Dubai through the
              perfect fusion of AI technology and human expertise.
            </p>
          </motion.div>

          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} RealFusion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
