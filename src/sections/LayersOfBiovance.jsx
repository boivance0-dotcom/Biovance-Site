import React from 'react'
import { motion } from 'framer-motion'

const LayersOfBiovance = () => {
  return (
    <section
      id="layers-of-biovance"
      className="w-full py-24 bg-[#F9F9EE] text-[#1A332C] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-8 mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight text-left"
        >
          Layers of Biovance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-lg opacity-80 max-w-2xl text-left leading-relaxed tracking-wide"
        >
          Two intelligent dimensions that connect curiosity and research — built to
          make the intelligence of Earth accessible to everyone.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 relative">
        {/* Divider Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1F7A67]/10 via-[#1F7A67]/30 to-[#317A60]/10"></div>

        {/* Left - Public Layer */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#DDEFE6] to-[#F1F8F4] px-8 md:px-10 py-16 flex flex-col items-center md:items-end text-center md:text-right border-b md:border-b-0 md:border-r border-[#1F7A67]/10"
        >
          <div className="max-w-md md:ml-auto">
            <div className="flex justify-center md:justify-end items-center gap-2">
              <span className="text-2xl opacity-70 hover:opacity-100 transition-opacity">🌿</span>
              <h3 className="text-2xl mr-29 font-semibold">Public Layer</h3>
            </div>
            <p className="mt-5 text-base leading-relaxed opacity-90">
              Open for everyone — students, educators, and nature enthusiasts.
              The Public Layer provides verified ecological knowledge, interactive visuals,
              and AI-driven insights that inspire curiosity about our planet.
            </p>
          </div>
        </motion.div>

        {/* Right - Private Layer */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#DDF0F1] to-[#E8F6F7] px-8 md:px-10 py-16 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="max-w-md md:mr-auto">
            <div className="flex justify-center md:justify-start items-center gap-2">
              <span className="text-2xl ml-29 opacity-70 hover:opacity-100 transition-opacity">🔬</span>
              <h3 className="text-2xl font-semibold">Private Layer</h3>
            </div>
            <p className="mt-5 text-base leading-relaxed opacity-90">
              Built for researchers, scientists, and institutions.
              The Private Layer offers deep insights, advanced analytics,
              and AI research models that decode nature's intelligence
              and accelerate ecological discovery.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mt-20 px-6"
      >
        <p className="text-lg font-medium opacity-85 max-w-3xl mx-auto leading-relaxed">
          Together, they form <span className="text-[#1F7A67] font-semibold">Biovance</span> —
          a living, evolving ecosystem where nature and intelligence coexist.
        </p>
      </motion.div>
    </section>
  )
}

export default LayersOfBiovance