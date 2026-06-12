import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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
import ProtectedRoute from './components/ProtectedRoute'
import Waitlist from './pages/Waitlist'
import { supabase } from './lib/supabase'

// Log Supabase initialization status
console.log('🚀 App starting...')
console.log('Supabase client available:', !!supabase)
console.log('Supabase auth available:', !!supabase?.auth)
console.log('Supabase storage available:', !!supabase?.storage)

const Home = () => (
  <div>
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
      </Routes>
    </AuthProvider>
  )
}

export default App
