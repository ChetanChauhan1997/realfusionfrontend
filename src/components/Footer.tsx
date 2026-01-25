import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
const Footer = () => {
  return (
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

                    <div className="text-slate-400 text-sm">© {new Date().getFullYear()} RealFusion. All rights reserved.</div>
                    <div className="text-sm mt-2">
                        Disclaimer
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        All data provided is for informational and educational purposes only and does not constitute financial, investment, legal, or tax advice. RealFusion Analytics is not a licensed financial advisor, broker, or investment firm. Any information, opinions, or recommendations expressed herein are general in nature and should not be relied upon for making investment decisions. Real estate markets, including Dubai, involve risks, and past performance is not indicative of future results. Readers are strongly encouraged to conduct their own independent research and consult with qualified financial, legal, and tax advisors before making any investment decisions. RealFusion Analytics assumes no liability for any loss or damage resulting from reliance on the information provided.
                    </div>
                </div>
            </footer>
  )
}

export default Footer
