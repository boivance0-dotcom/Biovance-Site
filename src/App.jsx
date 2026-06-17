import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SEO from './components/SEO'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Visionsection from './sections/Visionsection'
import LayersOfBiovance from './sections/LayersOfBiovance'
import Footer from './components/Footer'
import AboutUs from './sections/AboutUs'
import Updates from './pages/Updates'
import BlogDetail from './pages/BlogDetail'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminWaitlist from './components/AdminWaitlist'
import FloatingCard from './components/FloatingCard'
import Chatbot from './components/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'
import Waitlist from './pages/Waitlist'
import Contact from './pages/Contact'
import Search from './pages/Search'
import Backend from './pages/Backend'
import { supabase } from './lib/supabase'
import { initializeDatabase, ensureSupabaseCacheSynced } from './lib/supabaseUtils'

// Log Supabase initialization status
console.log('🚀 App starting...')
console.log('Supabase client available:', !!supabase)
console.log('Supabase auth available:', !!supabase?.auth)
console.log('Supabase storage available:', !!supabase?.storage)

const Home = () => (
  <div>
    <SEO
      title="AI That Learns from Nature"
      description="Exploring the intelligence of nature through AI-powered conservation research. Join our mission to protect biodiversity using cutting-edge machine learning and ecological insights."
      keywords="AI conservation, biodiversity research, machine learning ecology, nature intelligence, environmental technology, conservation AI, ecological research, biovance"
      image="/assets/myanmar_tm5_2004349_lrg.jpg"
      url="/"
    />
    <div className='h-screen bg-cover bg-center relative' style={{backgroundImage: 'url(/assets/myanmar_tm5_2004349_lrg.jpg)', backgroundPosition: 'center bottom'}}>
      <Navbar />
      <Hero />
    </div>
    <div className='relative mt-16 md:mt-20'>
      <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B593E] to-transparent pointer-events-none z-10'></div>
      <Visionsection />
    </div>
    <LayersOfBiovance />
    <AboutUs />
    <Footer />
    <FloatingCard />
  </div>
)

const App = () => {
  // Initialize database tables on app startup
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database first
        await initializeDatabase()

        // Then ensure Supabase cache is synced
        await ensureSupabaseCacheSynced()
      } catch (err) {
        console.error('❌ App initialization failed:', err)
      }
    }

    initApp()
  }, [])

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/waitlist" element={<ProtectedRoute><AdminWaitlist /></ProtectedRoute>} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/backend" element={<Backend />} />
      </Routes>
      <Chatbot />
    </AuthProvider>
  )
}

export default App
