import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { Mail, User, Phone, MapPin, ArrowRight, Globe } from 'lucide-react'

const Waitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('waitlist')
      .insert([formData])

    if (error) {
      console.error("❌ Waitlist submission error:", error.message)
      alert("Failed to join waitlist. Please try again.")
      setLoading(false)
      return
    }

    console.log("✅ Joined waitlist successfully")

    // Send welcome email
    try {
      const response = await fetch('https://rwwmyvrjvlibpzyqzxqg.functions.supabase.co/rapid-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          email: formData.email
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Welcome email failed:', errorText)
        // Don't show error to user, just log it
      } else {
        console.log('✅ Welcome email sent successfully')
      }
    } catch (emailError) {
      console.error('❌ Welcome email error:', emailError)
      // Don't show error to user, just log it
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className='min-h-screen'>
      <SEO
        title="Join the Conservation Revolution"
        description="Be among the first to access our AI-powered conservation intelligence platform. Join our exclusive waitlist and connect with researchers worldwide for a sustainable future."
        keywords="conservation waitlist, AI conservation platform, biodiversity research, environmental technology, conservation intelligence, early access"
        image="/assets/myanmar_tm5_2004349_lrg.jpg"
        url="/waitlist"
      />
      {/* Navbar */}
      <div className='bg-gradient-to-b from-green-900 to-green-800'>
        <Navbar />
      </div>

      {/* Unified Full-Page Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='relative min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 overflow-hidden py-24 md:py-32'
      >
        {/* Background Layers */}
        <motion.div
          className='absolute inset-0'
          animate={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/myanmar_tm5_2004349_lrg.jpg`}
            className='w-full h-full object-cover opacity-15 mix-blend-overlay'
            alt=""
          />
        </motion.div>

        {/* Floating particles */}
        <div className='absolute inset-0 overflow-hidden'>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-1 h-1 bg-white/30 rounded-full'
              style={{
                left: `${15 + i * 12}%`,
                top: `${25 + i * 8}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Bottom fade to white */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent'></div>

        {/* Navigation */}
        <div className='relative z-10 max-w-7xl mx-auto px-6 mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to='/' className='inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition font-["Inter"]'>
              ← Back to Home
            </Link>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className='relative z-10 max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]'>

            {/* Left Column - Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className='text-white'
            >
              <div className='flex items-center gap-3 mb-6'>
                <Globe className="w-8 h-8 text-green-300" />
                <span className='text-sm font-semibold text-green-200 tracking-wider uppercase'>Conservation Intelligence</span>
              </div>

              <h1 className='text-5xl md:text-6xl font-semibold font-["Space_Grotesk"] tracking-tight mb-6 leading-tight'>
                Join the Conservation Revolution
              </h1>

              <p className='text-lg md:text-xl text-green-100 leading-relaxed max-w-lg mb-8'>
                Be among the first to access our AI-powered conservation intelligence platform, connecting researchers worldwide for a sustainable future.
              </p>

              <div className='flex items-center gap-4 text-sm text-green-200'>
                <span className='flex items-center gap-2'>
                  <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                  Early Access Available
                </span>
                <span className='flex items-center gap-2'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></span>
                  Global Research Network
                </span>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8 md:p-12 text-center'
                >
                  <div className='text-6xl mb-6'>🎉</div>
                  <h3 className='text-2xl font-bold font-["Space_Grotesk"] text-green-900 mb-4'>
                    Welcome to the Waitlist!
                  </h3>
                  <p className='text-green-700 mb-8 leading-relaxed'>
                    Thank you for joining our exclusive waitlist. You'll be among the first to experience our revolutionary conservation intelligence platform.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link
                      to='/'
                      className='inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    >
                      🏠 Return to Home
                    </Link>
                    <Link
                      to='/updates'
                      className='inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    >
                      📖 View Updates
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className='bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8 md:p-12'>
                  <div className='mb-8'>
                    <h2 className='text-2xl font-bold font-["Space_Grotesk"] text-green-900 mb-2'>
                      Get Early Access
                    </h2>
                    <p className='text-gray-600 text-sm'>
                      Join our exclusive waitlist and be the first to experience our groundbreaking conservation intelligence platform.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='relative'>
                        <label className='block text-sm font-semibold text-green-800 mb-2'>Full Name *</label>
                        <div className='relative'>
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                          <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all placeholder-gray-400'
                            placeholder='Enter your full name'
                          />
                        </div>
                      </div>

                      <div className='relative'>
                        <label className='block text-sm font-semibold text-green-800 mb-2'>Email Address *</label>
                        <div className='relative'>
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                          <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all placeholder-gray-400'
                            placeholder='your@email.com'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='relative'>
                        <label className='block text-sm font-semibold text-green-800 mb-2'>Phone Number</label>
                        <div className='relative'>
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                          <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all placeholder-gray-400'
                            placeholder='+1 (555) 123-4567'
                          />
                        </div>
                      </div>

                      <div className='relative'>
                        <label className='block text-sm font-semibold text-green-800 mb-2'>Country *</label>
                        <div className='relative'>
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                          <select
                            name='country'
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all appearance-none'
                          >
                            <option value=''>Select your country</option>
                            <option value='United States'>🇺🇸 United States</option>
                            <option value='Canada'>🇨🇦 Canada</option>
                            <option value='United Kingdom'>🇬🇧 United Kingdom</option>
                            <option value='Australia'>🇦🇺 Australia</option>
                            <option value='Germany'>🇩🇪 Germany</option>
                            <option value='France'>🇫🇷 France</option>
                            <option value='Japan'>🇯🇵 Japan</option>
                            <option value='India'>🇮🇳 India</option>
                            <option value='Brazil'>🇧🇷 Brazil</option>
                            <option value='Mexico'>🇲🇽 Mexico</option>
                            <option value='South Korea'>🇰🇷 South Korea</option>
                            <option value='Netherlands'>🇳🇱 Netherlands</option>
                            <option value='Sweden'>🇸🇪 Sweden</option>
                            <option value='Norway'>🇳🇴 Norway</option>
                            <option value='Denmark'>🇩🇰 Denmark</option>
                            <option value='Finland'>🇮 Finland</option>
                            <option value='Singapore'>🇸🇬 Singapore</option>
                            <option value='New Zealand'>🇳🇿 New Zealand</option>
                            <option value='South Africa'>🇿🇦 South Africa</option>
                            <option value='Other'>🌍 Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className='pt-6'>
                      <button
                        type='submit'
                        disabled={loading}
                        className='group flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold px-8 py-4 rounded-lg hover:scale-105 transition-all w-full shadow-lg hover:shadow-xl'
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Joining Waitlist...
                          </>
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <p className='text-xs text-gray-500 text-center mb-4'>
                      By joining our waitlist, you agree to receive conservation research updates from Zytherion Biovance. We respect your privacy.
                    </p>
                    <div className='flex justify-center items-center gap-6 text-xs text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                        Data secured by Supabase
                      </span>
                      <span className='flex items-center gap-1'>
                        <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                        Supported by Arizona Ecological Board
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Waitlist