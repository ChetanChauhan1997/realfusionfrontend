"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import axios from "axios";
import apiPaths from "@/config/ApiPath";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/utils/RouteConfig";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const toast = useToast();
  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  /** ✅ Email validation — RFC compliant but practical */
  const validateEmail = (val: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);

  const validatePhone = (val: string) => !val || /^[0-9]{10}$/.test(val);

  const fetchCaptcha = async () => {
    try {
      const res = await api.get(apiPaths.GET_CAPTCHA, { responseType: "text" });
      setCaptchaSvg(res.data);
      setCaptchaInput("");
    } catch {
      toast("error", "Failed to load CAPTCHA. Try again.");
    }
  };

  /** 🔄 Reset all state when modal closes */
  const resetModal = () => {
    setForm({ name: "", email: "", phone: "" });
    setCaptchaInput("");
    setCaptchaSvg("");
    setOtp(["", "", "", "", "", ""]);
    setStep("form");
    setLoading(false);
    setEmailError("");
    setCountdown(0);
  };

  /** 🎯 Enhanced close handler */
  const handleClose = () => {
    resetModal();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      fetchCaptcha();
    } else {
      // Reset when modal is closed
      resetModal();
    }
  }, [isOpen]);

  /** ⏱️ Countdown Timer Effect */
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /** ✅ Handles all field updates */
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      if (!validateEmail(value)) setEmailError("Invalid email address");
      else setEmailError("");
    }
  };

  /** 🔢 Handle OTP Input */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /** ⌫ Handle Backspace */
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  /** 📋 Handle Paste */
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast("warning", "Enter your name");
    if (!validateEmail(form.email)) return setEmailError("Invalid email");
    if (!validatePhone(form.phone))
      return toast("warning", "Phone must be 10 digits");
    if (!captchaInput.trim()) return toast("warning", "Enter CAPTCHA");

    setLoading(true);

    try {
      // 1️⃣ Verify CAPTCHA
      const captchaRes = await api.post(apiPaths.VERIFY_CAPTCHA, {
        captcha: captchaInput,
      });

      if (!captchaRes.data.success) {
        toast("error", "Invalid CAPTCHA. Please try again.");
        fetchCaptcha();
        return;
      }

      // 2️⃣ Send OTP
      const res = await api.post(apiPaths.SEND_OTP, form);

      if (res.data.success) {
        toast("success", "OTP sent successfully!");
        setStep("otp");
        setCountdown(30); // Start 30s countdown
      } else {
        toast("error", res.data.message || "Failed to send OTP");
        fetchCaptcha();
      }
    } catch (err: any) {
      toast("error", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (!otpValue.trim()) return toast("warning", "Enter OTP");
    if (otpValue.length !== 6) return toast("warning", "OTP must be 6 digits");

    setLoading(true);
    try {
      const res = await api.post(apiPaths.USER_LOGIN, {
        ...form,
        otp: otpValue,
      });

      const { status, message, user, token } = res.data;
      if (status) {
        toast("success", message || "Login successful!");
        if (token) {
          sessionStorage.setItem("jwtAccessToken", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }
        handleClose();
        router.push(RouteConfig.DOCUMENTS);
      } else {
        toast("warning", message || "Login failed");
      }
    } catch (err: any) {
      toast("error", err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading || countdown > 0) return;
    setLoading(true);
    try {
      const res = await api.post(apiPaths.SEND_OTP, form);
      if (res.data.success) {
        toast("success", "OTP resent successfully!");
        setCountdown(30); // Restart countdown
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      } else {
        toast("error", res.data.message || "Failed to resend OTP");
      }
    } catch {
      toast("error", "Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
      >
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          {step === "form"
            ? <div dangerouslySetInnerHTML={{__html:"Sign Up and Receive our <br/> Latest Investment Reports"}} />
            : "Verify OTP"}
        </h2>

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={loading}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={loading}
                className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={10}
                disabled={loading}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-medium">CAPTCHA</label>
              <div className="flex items-center gap-2 mt-1">
                <div
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  className="border rounded-lg p-2 bg-gray-100 w-1/2 text-center"
                />
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={loading}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                  title="Reload CAPTCHA"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter CAPTCHA"
                className="w-full border rounded-lg px-3 py-2 mt-2"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!emailError}
              className={`w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Sending OTP..." : "Proceed"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-center mb-2">
                Enter the 6-digit OTP sent to your email
              </label>

              {/* 🔢 Modern OTP Input Boxes */}
              <div
                className="flex justify-center gap-2 mt-4"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={loading}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* ⏱️ Countdown & Resend */}
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || countdown > 0}
                className={`${
                  countdown > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:underline"
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp(["", "", "", "", "", ""]);
                  setCountdown(0);
                }}
                className="text-gray-500 hover:underline"
              >
                Back
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Verifying..." : "Proceed"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
