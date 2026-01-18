"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/toast-provider"
import api from "@/services"
import apiPaths from "@/config/ApiPath"

export default function ContactForm() {
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
      confirmEmail: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (formData.email !== formData.confirmEmail) {
        toast("warning", "Emails do not match")
        setIsSubmitting(false)
        return
      }

   
    try {
      const response = await api.post(apiPaths.STORE_CONTACT_US, formData)
      const payload = response?.data

      if (payload?.success) {
        toast("success", payload?.message || "Message sent successfully")
        setFormData({ name: "", email: "", confirmEmail: "", message: "" })
      } else {
        toast("warning", payload?.message || "Failed to send message")
      }
    } catch (error: any) {
      if (error.response) {
        toast("error", error.response.data?.message || "Something went wrong with server")
      } else {
        toast("error", error.message || "Network error")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f7f7f7] backdrop-blur-sm p-8 rounded-2xl shadow-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
            placeholder="Your Name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
            placeholder="your.email@example.com"
          />
        </div>
         {/* Confirm Email */}
        <div>
          <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
            placeholder="Confirm your email"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
            placeholder="Tell us about your investment goals..."
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-[#017BFC] to-[#40D3B6] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Send Message</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
