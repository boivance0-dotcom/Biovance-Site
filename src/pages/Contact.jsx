import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const form = useRef()
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    emailjs.init('NFRvRFBmSvQQSkUf6')
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Debug: Check what data EmailJS will receive
    const fd = new FormData(form.current)
    console.log('📧 EmailJS Form Data:')
    for (let pair of fd.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`)
    }

    try {
      console.log('Sending EmailJS request with:', {
        service: 'service_fx1v1vh',
        template: 'template_spqdqjn',
        publicKey: 'NFRvRFBmSvQQSkUf6'
      })

      const result = await emailjs.sendForm('service_fx1v1vh', 'template_spqdqjn', form.current, 'NFRvRFBmSvQQSkUf6')

      console.log('EmailJS result:', result)
      console.log('Contact form submitted successfully via EmailJS')

      setIsSubmitted(true)
      setFormData({ user_name: '', user_email: '', subject: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)

    } catch (error) {
      console.error('EmailJS Error Details:', {
        message: error.message,
        status: error.status,
        text: error.text
      })
      alert(`Failed to send message: ${error.text || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700'>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='relative pt-24 pb-16 px-4 sm:px-6 lg:px-8'
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-center mb-16'
          >
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
              Get In Touch
            </h1>
            <p className='text-xl md:text-2xl text-green-100 max-w-3xl mx-auto'>
              Ready to explore the intelligence of nature? We'd love to hear from you.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Information */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='space-y-8'
            >
              <div>
                <h2 className='text-3xl font-bold text-white mb-6'>Contact Information</h2>
                <p className='text-green-100 text-lg mb-8'>
                  Whether you're interested in our research, partnerships, or just want to learn more about AI-powered conservation, we're here to help.
                </p>
              </div>

              <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-white/10 rounded-lg backdrop-blur-sm'>
                    <Mail className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className='text-white font-semibold'>Email</h3>
                    <p className='text-green-100'>info@zytherionbiovance.com</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-white/10 rounded-lg backdrop-blur-sm'>
                    <Phone className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className='text-white font-semibold'>Phone</h3>
                    <p className='text-green-100'>Available upon request</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-white/10 rounded-lg backdrop-blur-sm'>
                    <MapPin className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className='text-white font-semibold'>Location</h3>
                    <p className='text-green-100'>Global Conservation Research</p>
                  </div>
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-4'>Research Partnerships</h3>
                <p className='text-green-100 mb-4'>
                  Interested in collaborating on AI-powered conservation research? We're always looking for partners who share our vision.
                </p>
                <Link
                  to="/waitlist"
                  className='inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors font-medium'
                >
                  Join our research community →
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20'
            >
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Send us a Message</h2>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className='text-green-800 font-medium'>Message sent successfully! We'll get back to you soon.</span>
                </motion.div>
              )}

              <form ref={form} onSubmit={handleSubmit} className='space-y-6'>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                    <input
                      type='text'
                      name='user_name'
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                      placeholder='Your name'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <input
                      type='email'
                      name='user_email'
                      value={formData.user_email}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                      placeholder='your@email.com'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Subject</label>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                    placeholder='How can we help?'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Message</label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none'
                    placeholder='Tell us about your project or question...'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Contact