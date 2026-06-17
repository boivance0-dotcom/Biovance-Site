import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Visionsection = () => {
  const [activeVision, setActiveVision] = useState(null)

  const visions = [
    {
      id: 1,
      title: "Collect & Secure Research Data",
      preview: "We gather and protect biodiversity data from scientists and conservation groups, ensuring it stays safe, verified, and accessible for collaboration.",
      expanded: "We gather and protect biodiversity data from scientists and conservation groups, ensuring it stays safe, verified, and accessible for collaboration.",
      smallImage: "/assets/41308.jpg",
      heroImage: "/assets/41308.jpg"
    },
    {
      id: 2,
      title: "Organize Environmental Intelligence",
      preview: "Our AI systems structure and tag ecological datasets, transforming complex research into shareable, actionable insights.",
      expanded: "Our AI systems structure and tag ecological datasets, transforming complex research into shareable, actionable insights.",
      smallImage: "/assets/vibrant-coral-reef-ecosystem.webp",
      heroImage: "/assets/vibrant-coral-reef-ecosystem.webp"
    },
    {
      id: 3,
      title: "Connect Global Conservation Networks",
      preview: "We link researchers, restoration teams, and organizations worldwide, creating one unified network for ecological discovery.",
      expanded: "We link researchers, restoration teams, and organizations worldwide, creating one unified network for ecological discovery.",
      smallImage: "/assets/27Storms.webp",
      heroImage: "/assets/27Storms.webp"
    },
    {
      id: 4,
      title: "Enable Secure Data Collaboration",
      preview: "Our backend architecture allows organizations to share verified findings without exposing sensitive or private habitat information.",
      expanded: "Our backend architecture allows organizations to share verified findings without exposing sensitive or private habitat information.",
      smallImage: "/assets/myanmar_tm5_2004349_lrg.jpg",
      heroImage: "/assets/myanmar_tm5_2004349_lrg.jpg"
    },
    {
      id: 5,
      title: "Accelerate Real-World Restoration",
      preview: "We empower on-ground projects in regions like Arizona to test, measure, and scale restoration models that protect endangered species.",
      expanded: "We empower on-ground projects in regions like Arizona to test, measure, and scale restoration models that protect endangered species.",
      smallImage: "/assets/080824_Reforestation-projects-around-the-world-success-stories-and-lessons-learnedVisual-2.webp",
      heroImage: "/assets/080824_Reforestation-projects-around-the-world-success-stories-and-lessons-learnedVisual-2.webp"
    },
    {
      id: 6,
      title: "Build Scalable Environmental Intelligence",
      preview: "By combining AI with ecological data, we’re creating a foundation for global, data-driven conservation — where insights lead to real change.",
      expanded: "By combining AI with ecological data, we’re creating a foundation for global, data-driven conservation — where insights lead to real change.",
      smallImage: "/assets/rs=w_1200,cg_true (1).webp",
      heroImage: "/assets/rs=w_1200,cg_true (1).webp"
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#052E20] to-[#0B593E] relative overflow-hidden pt-32 md:pt-40'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05),transparent_70%)]'></div>
      <div className='relative flex items-center justify-center py-20 px-6 md:px-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className='w-full md:w-4/5 rounded-3xl bg-yellow-50 backdrop-blur-xl border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.3)] mt-4 p-8 md:p-12'
        >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-green-900 via-[#041b1a] to-[#b2dfdb] bg-clip-text text-transparent'>Our Vision — Intelligent Conservation for a Living Planet</h2>
          <p className='text-xl text-black/80 font-["Inter"]'>Zytherion Biovance unites scientists, conservationists, and technology experts to restore ecosystems and protect endangered species. We believe that nature and data can work together — by building secure, intelligent systems that help researchers share insights, accelerate restoration, and make global collaboration seamless. Every dataset, every discovery, and every partnership brings us closer to a future where technology learns from the natural world itself.</p>
        </motion.div>

        {activeVision && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(20,184,166,0.15)] mb-12'
          >
            <div className='flex flex-col md:flex-row gap-8 items-center'>
              <div className='md:w-1/2'>
                <img src={activeVision.heroImage} alt={activeVision.title} className='w-full h-auto rounded-xl shadow-lg ring-2 ring-green-600/30 ring-offset-2 ring-offset-transparent'/>
              </div>
              <div className='md:w-1/2'>
                <h3 className='text-3xl md:text-4xl font-semibold text-black/70 mb-6 font-["Space_Grotesk"]'>{activeVision.title}</h3>
                <p className='text-black/80 text-lg leading-relaxed font-["Inter"]'>{activeVision.expanded}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {visions.map((vision, index) => (
            <motion.div
              key={vision.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setActiveVision(activeVision?.id === vision.id ? null : vision)}
              className={`bg-green-700/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(20,184,166,0.2)] ${
                activeVision?.id === vision.id
                  ? 'border-green-700/50 shadow-[0_0_40px_rgba(20,184,166,0.3)] bg-white/15'
                  : 'border-green-900/60'
              }`}
            >
              <img src={vision.smallImage} alt={vision.title} className='w-16 h-16 mx-auto mb-4 rounded-xl object-cover ring-1 ring-zinc-900'/>
              <h4 className='text-xl font-semibold text-black mb-2 font-["Space_Grotesk"] text-center'>{vision.title}</h4>
              <p className='text-black/70 text-center font-["Inter"]'>{vision.preview}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='text-center mt-8'
        >
          <p className='text-lg text-black/70 font-["Inter"]'>Zytherion Biovance is developing its conservation intelligence systems in Arizona — building measurable, scalable solutions for a global ecological future.</p>
        </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Visionsection;