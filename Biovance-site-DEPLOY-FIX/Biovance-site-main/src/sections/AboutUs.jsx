import React from 'react'
import { motion } from 'framer-motion'

const AboutUs = () => {
  const pillars = [
    {
      title: 'Collaboration',
      description: 'We unite researchers, organizations, and conservationists through shared data and open scientific frameworks.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Security',
      description: 'We protect sensitive ecological data with layered privacy systems that let teams share insights, not raw information.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Impact',
      description: 'Every dataset and discovery leads to measurable restoration outcomes and scalable global change.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  return (
    <section id="about" className='py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-white to-green-50'>
      {/* Subtle decorative background */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-green-400 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-emerald-400 to-transparent rounded-full blur-3xl'></div>
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative'
          >
            {/* Vertical Accent Line */}
            <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-800 via-emerald-600 to-green-800 opacity-30 -ml-6'></div>

            {/* Main Title with Gradient */}
            <h2 className='text-5xl font-semibold font-["Space_Grotesk"] tracking-tight bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent mb-4' style={{letterSpacing: '-0.5px'}}>
              About Zytherion Biovance
            </h2>
            
            {/* Tagline */}
            <p className='text-xl font-["Inter"] text-gray-600 mb-8 italic font-medium'>
              Where ecological intelligence meets human innovation.
            </p>
            
            {/* Main Description */}
            <div className='max-w-3xl space-y-6 mb-12'>
              <p className='text-[1.05rem] leading-relaxed text-gray-700 font-["Inter"]'>
                Zytherion Biovance is a conservation-driven organization pioneering data-based environmental restoration.
                We bring together scientists, researchers, and technology experts to protect ecosystems, rebuild biodiversity, and share ecological knowledge responsibly.
              </p>
              <p className='text-[1.05rem] leading-relaxed text-gray-700 font-["Inter"]'>
                By combining AI, secure data infrastructure, and global collaboration, we enable faster, smarter, and more transparent conservation decisions — starting in Arizona, and expanding worldwide.
              </p>
            </div>

            {/* What Drives Us Section */}
            <div className='mb-10'>
              <h3 className='text-3xl font-semibold font-["Space_Grotesk"] text-green-900 mb-8'>
                What Drives Us
              </h3>
              
              <div className='space-y-8'>
                {pillars.map((pillar, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className='flex items-start space-x-5'
                  >
                    {/* Icon with Background Circle */}
                    <div className='flex-shrink-0 bg-green-50 p-3 rounded-full shadow-sm text-green-700 border border-green-100'>
                      {pillar.icon}
                    </div>
                    
                    {/* Content */}
                    <div className='flex-1'>
                      <h4 className='text-lg font-semibold font-["Inter"] text-green-900 mb-2'>
                        {pillar.title}
                      </h4>
                      <p className='text-gray-700 font-["Inter"] leading-relaxed'>
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Closing Statement */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className='text-[1.05rem] font-["Inter"] text-gray-700 italic leading-relaxed border-l-2 border-green-600 pl-4'
            >
              Headquartered in Arizona, we work at the intersection of science and technology — building a connected global ecosystem where data helps life thrive.
            </motion.p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative lg:pl-8'
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className='relative overflow-hidden rounded-2xl'
              style={{
                boxShadow: '0 4px 20px rgba(5, 59, 46, 0.15)'
              }}
            >
              <img
                src='/assets/vibrant-coral-reef-ecosystem.webp'
                alt='Ecological restoration and biodiversity'
                className='w-full h-auto object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent pointer-events-none'></div>
            </motion.div>

            {/* Decorative Element */}
            <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-2xl opacity-20 -z-10'></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
