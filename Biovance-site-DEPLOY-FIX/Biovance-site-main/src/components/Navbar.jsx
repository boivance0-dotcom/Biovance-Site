import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlowingButton } from './ui/glowing-button'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Check if we're on admin page
  const isAdminPage = window.location.pathname.startsWith('/admin')

  return (
    <div className={`h-16 md:h-20 w-full fixed top-0 left-0 z-30 flex rounded-br-2xl rounded-bl-2xl shadow-lg ${
      isAdminPage
        ? 'bg-white shadow-sm border-b border-gray-200'
        : 'bg-black/20 backdrop-blur-md border border-white/20'
    }`}>
      <div className='flex items-center h-full ml-4 md:ml-10'>
        <h1 className='text-lg md:text-2xl font-serif font-bold text-gray-900 heading shadow-2xl shadow-black/95 navbar-accent'>ZYTHERION BIOVANCE</h1>
      </div>

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-center gap-4 lg:gap-8 ml-auto mr-4 lg:mr-10 h-full'>
        <Link to="/">
         <li className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg no-underline ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>Home
         </li>
         </Link>

         <li onClick={() => { const element = document.getElementById('about'); if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' }); }} className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg no-underline cursor-pointer ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>About</li>

         <Link to="/updates">
         <li className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>
         Updates
         </li>
         </Link>

         <Link to="/contact">
         <li className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>
         Contact
         </li>
         </Link>

         <Link to="/search">
         <li className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>
         Search
         </li>
         </Link>

         <Link to="/backend">
         <li className={`text-lg lg:text-xl navbar-btn rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline ${
           isAdminPage
             ? 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20'
         }`}>
         Platform
         </li>
         </Link>

         <Link to="/waitlist">
         <GlowingButton className={`rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
           isAdminPage
             ? 'text-gray-900 bg-green-600 hover:bg-green-700'
             : 'text-white backdrop-blur-sm bg-white/10 border border-white/20'
         }`} glowColor="#22c55e">
           Join Waitlist
         </GlowingButton>
         </Link>
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden ml-auto mr-4 p-2 ${isAdminPage ? 'text-gray-700' : 'text-white'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 border-t rounded-br-2xl rounded-bl-2xl shadow-lg ${
          isAdminPage
            ? 'bg-white border-gray-200'
            : 'bg-black/90 backdrop-blur-md border-white/20'
        }`}>
          <ul className='flex flex-col py-4'>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <li className={`py-3 px-6 transition-colors ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}>Home</li>
            </Link>
            <li
              onClick={() => {
                const element = document.getElementById('about');
                if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
                setIsOpen(false);
              }}
              className={`py-3 px-6 transition-colors cursor-pointer ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              About
            </li>
            <Link to="/updates" onClick={() => setIsOpen(false)}>
              <li className={`py-3 px-6 transition-colors ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}>Updates</li>
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              <li className={`py-3 px-6 transition-colors ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}>Contact</li>
            </Link>
            <Link to="/search" onClick={() => setIsOpen(false)}>
              <li className={`py-3 px-6 transition-colors ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}>Search</li>
            </Link>
            <Link to="/backend" onClick={() => setIsOpen(false)}>
              <li className={`py-3 px-6 transition-colors ${
                isAdminPage
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}>Platform</li>
            </Link>
            <li className='px-6 py-3'>
              <Link to="/waitlist" onClick={() => setIsOpen(false)}>
                <GlowingButton className={`w-full rounded-full py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isAdminPage
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-white backdrop-blur-sm bg-white/10 border border-white/20'
                }`} glowColor="#22c55e">
                  Join Waitlist
                </GlowingButton>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
