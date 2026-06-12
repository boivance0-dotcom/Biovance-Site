import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogEditor from '../components/BlogEditor'
import AdminGallery from '../components/AdminGallery'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Users, Image, BarChart3, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingBlog, setEditingBlog] = useState(undefined)
  const [blogs, setBlogs] = useState([])
  const [stats, setStats] = useState({
    totalBlogs: 0,
    newsletterSubs: 0,
    waitlist: 0,
    mediaFiles: 0
  })
  const { user, signOut, isAuthenticated } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login'
    }
  }, [isAuthenticated])

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let blogsCountValue = 0

        // Fetch blogs count with error handling
        try {
          const { count: blogsCount } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
          blogsCountValue = blogsCount || 0
        } catch (error) {
          console.warn('Blogs table not found, using 0 count')
          blogsCountValue = 0
        }

        // Fetch media files count
        let mediaCount = 0
        try {
          const { data: mediaData } = await supabase.storage
            .from('test-bucket')
            .list('', { limit: 1000 })
          mediaCount = mediaData?.length || 0
        } catch (error) {
          console.warn('Error fetching media count:', error)
          mediaCount = 0
        }

        // Fetch newsletter subscribers count
        let newsletterCount = 0
        try {
          const { count: newsletterSubsCount } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true })
          newsletterCount = newsletterSubsCount || 0
        } catch (error) {
          console.warn('Newsletter subscribers table not found, using 0 count')
          newsletterCount = 0
        }

        // Fetch waitlist count
        let waitlistCount = 0
        try {
          const { count: waitlistSubsCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
          waitlistCount = waitlistSubsCount || 0
        } catch (error) {
          console.warn('Waitlist table not found, using 0 count')
          waitlistCount = 0
        }

        setStats({
          totalBlogs: blogsCountValue,
          newsletterSubs: newsletterCount,
          waitlist: waitlistCount,
          mediaFiles: mediaCount
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          totalBlogs: 0,
          newsletterSubs: 0,
          waitlist: 0,
          mediaFiles: 0
        })
      }
    }

    if (isAuthenticated()) {
      fetchStats()
    }
  }, [isAuthenticated])

  // Fetch blogs for management
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching blogs:', error)
          return
        }

        setBlogs(data || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }

    if (isAuthenticated()) {
      fetchBlogs()
    }
  }, [isAuthenticated])



  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
  }

  const handleDeleteBlog = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("Delete error:", error.message)
        alert("Failed to delete blog")
      } else {
        // Refresh the blogs list
        setBlogs(blogs.filter(b => b.id !== id))
        alert("Blog deleted successfully!")
      }
    }
  }


  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Navbar */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className='relative py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-36 translate-x-36'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-24 -translate-x-24'></div>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='max-w-5xl'>
            <Link to='/' className='inline-flex items-center text-white/80 hover:text-white transition-all duration-200 mb-8 text-sm font-medium hover:translate-x-1'>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className='text-4xl md:text-5xl font-bold mb-2 font-["Inter"]'>
                  Admin Dashboard
                </h1>
                <p className='text-lg text-white/90 font-["Inter"] leading-relaxed'>
                  Comprehensive management center for your Biovance ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className='py-6 bg-white border-b border-gray-200 shadow-sm'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-wrap justify-between items-center gap-6'>
            <nav className='flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl'>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
                { id: 'blogs', label: 'Blog Writing', icon: FileText, color: 'green' },
                { id: 'users', label: 'Users & Members', icon: Users, color: 'purple' },
                { id: 'waitlist', label: 'Waitlist', icon: Users, color: 'indigo' },
                { id: 'gallery', label: 'Media Gallery', icon: Image, color: 'pink' },
                { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-600 text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : `text-${tab.color}-600`}`} />
                  <span className='hidden sm:inline'>{tab.label}</span>
                  <span className='sm:hidden'>{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </nav>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className='text-sm font-medium text-gray-700 hidden sm:block'>
                  {user?.email}
                </span>
              </div>
              <button
                onClick={async () => {
                  await signOut()
                  window.location.href = '/'
                }}
                className='flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5'
              >
                <LogOut className="w-4 h-4" />
                <span className='hidden sm:inline'>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className='py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen'>
        <div className='container mx-auto px-6 max-w-7xl'>
          {activeTab === 'overview' && (
            <div className='space-y-8'>
              {/* Welcome Message */}
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-gray-900 mb-1'>Welcome back, Admin!</h2>
                    <p className='text-blue-700'>Here's what's happening with your Biovance ecosystem today.</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='p-3 bg-blue-100 rounded-xl'>
                      <FileText className='w-6 h-6 text-blue-600' />
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-gray-900'>{stats.totalBlogs}</p>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Total Blogs</p>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className='bg-blue-500 h-2 rounded-full' style={{width: '75%'}}></div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='p-3 bg-green-100 rounded-xl'>
                      <Users className='w-6 h-6 text-green-600' />
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-gray-900'>{stats.newsletterSubs}</p>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Newsletter</p>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className='bg-green-500 h-2 rounded-full' style={{width: '60%'}}></div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='p-3 bg-purple-100 rounded-xl'>
                      <Users className='w-6 h-6 text-purple-600' />
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-gray-900'>{stats.waitlist}</p>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Waitlist</p>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className='bg-purple-500 h-2 rounded-full' style={{width: '85%'}}></div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='p-3 bg-orange-100 rounded-xl'>
                      <Image className='w-6 h-6 text-orange-600' />
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-gray-900'>{stats.mediaFiles}</p>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Media Files</p>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className='bg-orange-500 h-2 rounded-full' style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-green-100 rounded-lg'>
                      <FileText className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>Create Blog Post</h3>
                      <p className='text-sm text-gray-600'>Write and publish new content</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className='w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium'
                  >
                    Start Writing →
                  </button>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <Users className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>Manage Users</h3>
                      <p className='text-sm text-gray-600'>View waitlist and members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('waitlist')}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium'
                  >
                    View Members →
                  </button>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-purple-100 rounded-lg'>
                      <Image className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>Media Gallery</h3>
                      <p className='text-sm text-gray-600'>Upload and manage images</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium'
                  >
                    Open Gallery →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className='space-y-8'>
              {editingBlog !== undefined ? (
                // Show editor when editing or creating new
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={() => setEditingBlog(undefined)}
                        className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md'
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blogs
                      </button>
                      <div className='h-6 w-px bg-gray-300'></div>
                      <div>
                        <h1 className='text-2xl font-bold text-gray-900'>
                          {editingBlog ? 'Edit Blog Post' : 'Create New Blog'}
                        </h1>
                        <p className='text-gray-600'>
                          {editingBlog ? 'Make changes to your blog post' : 'Write and publish engaging content'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <BlogEditor
                    editingBlog={editingBlog}
                    onSave={() => {
                      setEditingBlog(undefined);
                      // Refresh blogs list
                      window.location.reload();
                    }}
                  />
                </div>
              ) : (
                // Show blogs list
                <div className='space-y-6'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                    <div>
                      <h2 className='text-3xl font-bold text-gray-900'>Blog Management</h2>
                      <p className='text-gray-600 mt-1'>Create, edit, and manage your blog posts</p>
                    </div>
                    <button
                      onClick={() => setEditingBlog(null)} // null for new blog
                      className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium'
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Write New Blog
                    </button>
                  </div>

                  {blogs.length === 0 ? (
                    <div className='bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden'>
                      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50'></div>
                      <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full blur-2xl opacity-50'></div>
                      <div className='relative z-10'>
                        <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
                          <FileText className='w-10 h-10 text-white' />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-3'>Start Your Blog Journey</h3>
                        <p className='text-gray-600 mb-8 max-w-md mx-auto leading-relaxed'>
                          Create your first blog post and share your insights on AI-powered conservation with the world.
                        </p>
                        <button
                          onClick={() => setEditingBlog(null)} // null for new blog
                          className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg'
                        >
                          ✍️ Write Your First Blog
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                      {blogs.map((blog) => (
                        <div key={blog.id} className='bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group'>
                          {blog.featured_image && (
                            <div className='relative h-48 overflow-hidden'>
                              <img
                                src={blog.featured_image}
                                alt="Featured"
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                              />
                              <div className='absolute top-4 right-4'>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  blog.published
                                    ? 'bg-green-500 text-white'
                                    : 'bg-yellow-500 text-white'
                                }`}>
                                  {blog.published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className='p-6'>
                            <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                              {blog.title}
                            </h3>
                            <p className='text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed'>
                              {blog.excerpt || blog.content?.substring(0, 120) + '...' || 'No content preview available'}
                            </p>
                            <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                              <span className='flex items-center gap-1'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {blog.author || 'Unknown'}
                              </span>
                              <span className='flex items-center gap-1'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(blog.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className='flex gap-3'>
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:shadow-md transform hover:-translate-y-0.5'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className='px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium hover:shadow-md border border-red-200'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className='space-y-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>User Management</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Newsletter Subscribers</h3>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                      <div className='text-center py-8 text-gray-500'>
                        <Users className='w-12 h-12 mx-auto mb-3 opacity-50' />
                        <p>No subscribers data available</p>
                        <p className='text-sm'>Newsletter integration coming soon</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Waitlist Members</h3>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                      <div className='text-center py-8 text-gray-500'>
                        <Users className='w-12 h-12 mx-auto mb-3 opacity-50' />
                        <p>No waitlist data available</p>
                        <p className='text-sm'>Waitlist integration coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'waitlist' && (
            <div className='space-y-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>Waitlist Management</h2>
                  <Link
                    to="/admin/waitlist"
                    className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2'
                  >
                    📋 View Full Waitlist
                  </Link>
                </div>
                <p className='text-gray-600 mb-6'>Monitor and manage waitlist registrations. Click "View Full Waitlist" for detailed management.</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-purple-700'>Total Signups</p>
                        <p className='text-3xl font-bold text-purple-900'>{stats.waitlist}</p>
                      </div>
                      <Users className='w-10 h-10 text-purple-600' />
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-green-700'>This Month</p>
                        <p className='text-3xl font-bold text-green-900'>--</p>
                      </div>
                      <BarChart3 className='w-10 h-10 text-green-600' />
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-blue-700'>Conversion Rate</p>
                        <p className='text-3xl font-bold text-blue-900'>--</p>
                      </div>
                      <Settings className='w-10 h-10 text-blue-600' />
                    </div>
                  </div>
                </div>

                <div className='mt-8'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Link
                      to="/admin/waitlist"
                      className='bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3'
                    >
                      <Users className='w-5 h-5' />
                      <div>
                        <div className='font-semibold'>View All Entries</div>
                        <div className='text-sm opacity-90'>Detailed waitlist management</div>
                      </div>
                    </Link>

                    <button className='bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3'>
                      <FileText className='w-5 h-5' />
                      <div>
                        <div className='font-semibold'>Export Data</div>
                        <div className='text-sm opacity-90'>Download CSV file</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && <AdminGallery />}

          {activeTab === 'settings' && (
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Settings</h2>
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Site Title</label>
                  <input type='text' defaultValue='Zutherion Biovance' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Admin Email</label>
                  <input type='email' defaultValue='admin@zutherionbiovance.com' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Newsletter Settings</label>
                  <div className='space-y-2'>
                    <label className='flex items-center'>
                      <input type='checkbox' defaultChecked className='mr-2' />
                      Auto-send welcome emails
                    </label>
                    <label className='flex items-center'>
                      <input type='checkbox' defaultChecked className='mr-2' />
                      Enable double opt-in
                    </label>
                  </div>
                </div>
                <button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors'>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Admin