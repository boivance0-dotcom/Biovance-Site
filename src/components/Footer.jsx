import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-b from-emerald-50 to-white text-gray-700 py-16 border-t border-green-100 shadow-inner"
    >
      {/* Seamless blend with previous section */}
      <div className="absolute -top-8 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-emerald-50"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold font-['Space_Grotesk'] tracking-tight text-green-800">
                ZYTHERION BIOVANCE
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md mb-4">
              Advancing AI-driven solutions for wildlife conservation, ecosystem restoration, and global collaboration.
            </p>

            {/* Address */}
            <address className="text-gray-600 text-sm not-italic mb-6">
              11225 North 28th Drive<br />
              Suite F110<br />
              Phoenix, AZ 85029
            </address>
          </motion.div>

          {/* Mission Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h4 className="text-lg font-semibold font-['Space_Grotesk'] text-green-800 mb-3">
              Our Mission
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Harnessing the power of AI to unlock nature's intelligence, driving sustainable solutions for a thriving planet.
            </p>

            <div className="mt-6 pt-6 border-t border-green-100">
              <p className="text-xs text-gray-500">
                Data integrity verified by Supabase • Supported by Arizona Ecological Board
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 pt-6 border-t border-green-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
        >
          <div>
            © 2025-26 Zytherion Biovance. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 pointer-events-auto">
            <Link to="/contact" className="hover:text-green-700 transition-colors">Contact</Link>
            <a href="#" className="hover:text-green-700 transition-colors">Research</a>
          </div>
        </motion.div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>
    </motion.footer>
  )
}

export default Footer;