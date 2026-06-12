import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const FloatingCard = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeMode, setActiveMode] = useState('updates') // 'updates' only

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.3 && !isClosed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClosed])



  if (!isVisible || isClosed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50'
      >
        <div className='bg-white/95 backdrop-blur-md border-2 border-green-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 max-w-sm'>
          <button
            onClick={() => setIsClosed(true)}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10'
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className='p-6 pb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <BookOpen className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 className='text-lg font-semibold font-["Space_Grotesk"] text-green-900'>
                  Learn More
                </h4>
                <p className='text-sm text-gray-600'>
                  About Our Mission
                </p>
              </div>
            </div>
          </div>


          {/* Content Area */}
          <div className='px-6 pb-6'>
            <p className='text-sm font-["Inter"] text-gray-700 mb-4 leading-relaxed'>
              Discover how we're using AI to revolutionize wildlife conservation and ecosystem restoration worldwide.
            </p>
            <Link
              to='/updates'
              className='inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-sm transition-colors group'
            >
              Explore Updates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingCard