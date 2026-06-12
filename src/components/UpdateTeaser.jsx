import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const UpdateTeaser = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [latestBlog, setLatestBlog] = useState(null)

  useEffect(() => {
    const fetchLatestBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        setLatestBlog(data)
      }
    }

    fetchLatestBlog()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.4 && !isClosed) {
        setIsVisible(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClosed])

  if (!isVisible || isClosed || !latestBlog) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className='fixed bottom-6 right-6 z-50 max-w-sm'
    >
      <div className='bg-gradient-to-r from-green-700 to-emerald-600 border border-white/20 rounded-xl p-4 md:p-5 shadow-xl backdrop-blur-sm hover:shadow-[0_10px_40px_rgba(5,150,105,0.4)] transition-all duration-300 hover:-translate-y-1'>
        <button
          onClick={() => setIsClosed(true)}
          className='absolute top-3 right-3 text-white/70 hover:text-white transition-colors text-lg'
          aria-label="Close"
        >
          ✕
        </button>
        <div className='pr-4'>
          <img src={latestBlog.featured_image} alt={latestBlog.title} className='w-full h-24 object-cover rounded-lg mb-3' />
          <h4 className='text-lg font-semibold font-["Space_Grotesk"] text-white mb-2'>{latestBlog.title}</h4>
          <p className='text-sm font-["Inter"] text-green-100 mb-4 leading-relaxed'>
            {latestBlog.content.slice(0, 100)}...
          </p>
          <Link
            to='/updates'
            className='text-white/90 hover:underline transition-all font-["Inter"] text-sm flex items-center gap-1 font-medium'
          >
            View Updates →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default UpdateTeaser
