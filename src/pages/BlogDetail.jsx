import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  // Share functions
  const handleShare = async () => {
    const url = window.location.href
    const title = blog.title
    const text = `Check out this article: ${title}`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // Simple feedback - you could add a toast notification here
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching blog:', error)
        } else {
          setBlog(data)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
        <Navbar />
        <div className='pt-20 pb-12'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Blog not found</h1>
            <Link to='/updates' className='text-green-600 hover:text-green-800'>← Back to Updates</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Extract excerpt from content for SEO
  const excerpt = blog.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...'

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50'>
      <SEO
        title={blog.title}
        description={excerpt}
        keywords={`conservation research, ${blog.author}, biodiversity, AI ecology, ${blog.title.toLowerCase()}`}
        image={blog.featured_image || '/assets/41308.jpg'}
        url={`/blogs/${blog.id}`}
        type="article"
        author={blog.author}
        published={blog.created_at}
        modified={blog.updated_at || blog.created_at}
        section="Conservation Research"
        articleData={{
          headline: blog.title,
          author: blog.author,
          datePublished: blog.created_at,
          dateModified: blog.updated_at || blog.created_at,
          articleSection: "Conservation Research"
        }}
      />
      <Navbar />

      {/* Hero Section with Featured Image */}
      <section className='relative pt-20 pb-12 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5'></div>
        <div className='container mx-auto px-6 relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-4xl mx-auto'
          >
            {/* Back Navigation */}
            <Link
              to='/updates'
              className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-8 hover:translate-x-1'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Updates
            </Link>

            {/* Featured Image */}
            <div className='relative mb-8 rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src={blog.featured_image || '/assets/41308.jpg'}
                alt={blog.title}
                className='w-full h-64 md:h-96 object-cover'
                loading="lazy"
                decoding="async"
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
            </div>

            {/* Article Header */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 -mt-16 relative z-10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                  {blog.author?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>{blog.author || 'Anonymous'}</p>
                  <p className='text-sm text-gray-600 flex items-center gap-2'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
                {blog.title}
              </h1>

              {/* Reading Time & Tags */}
              <div className='flex items-center justify-between border-t border-gray-100 pt-6'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.ceil((blog.content?.replace(/<[^>]*>/g, '').length || 0) / 200)} min read
                  </div>
                  {blog.published && (
                    <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                      Published
                    </span>
                  )}
                </div>

                {/* Social Share Buttons */}
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handleShare}
                    className='p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-lg hover:scale-105'
                    title="Share this article"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className='p-2 text-gray-400 hover:text-green-600 transition-all duration-200 hover:bg-green-50 rounded-lg hover:scale-105'
                    title="Copy link"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className='py-12'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='max-w-4xl mx-auto'
          >
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12'>
              <div
                className='prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-img:rounded-xl prose-img:shadow-lg'
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Article Footer */}
            <div className='mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl'>
                    {blog.author?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-900'>{blog.author || 'Anonymous'}</h3>
                    <p className='text-gray-600 text-sm'>Author</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-600'>Published on</p>
                  <p className='font-semibold text-gray-900'>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles / Navigation */}
            <div className='mt-12 flex justify-between items-center'>
              <Link
                to='/updates'
                className='flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:shadow-md'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Articles
              </Link>

              <div className='flex gap-2'>
                <button className='p-3 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className='p-3 text-gray-400 hover:text-blue-500 transition-colors hover:bg-blue-50 rounded-lg'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogDetail