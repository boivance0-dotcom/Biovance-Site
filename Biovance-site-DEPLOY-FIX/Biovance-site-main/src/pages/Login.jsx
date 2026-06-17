import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        if (isSignUp) {
          setError('Check your email for the confirmation link!')
        } else {
          navigate('/admin')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }

    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Navbar */}
      <div className='bg-gradient-to-b from-green-900 to-green-800'>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className='relative py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-6 relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-4xl'
          >
            <Link to='/' className='inline-flex items-center gap-2 text-green-200 hover:text-white transition font-["Inter"] mb-6'>
              ← Back to Home
            </Link>
            <h1 className='text-4xl md:text-5xl font-bold font-["Space_Grotesk"] mb-6'>
              Admin Access Portal
            </h1>
            <p className='text-xl font-["Inter"] text-green-100 leading-relaxed max-w-3xl'>
              Secure login for content management and administrative functions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='max-w-md mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'
            >
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold font-["Space_Grotesk"] text-green-900 mb-2'>
                  {isSignUp ? 'Create Admin Account' : 'Admin Login'}
                </h2>
                <p className='text-gray-600 text-sm'>
                  {isSignUp
                    ? 'Register for administrative access'
                    : 'Sign in to manage content and data'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-semibold text-green-800 mb-2'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all'
                      placeholder='admin@biovance.com'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-green-800 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className='w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-green-600 transition-all'
                      placeholder='Enter your password'
                    />
                  </div>
                </div>

                {error && (
                  <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                    {error}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className='mt-6 text-center'>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className='text-green-600 hover:text-green-800 text-sm font-medium transition-colors'
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : 'Need an account? Sign up'
                  }
                </button>
              </div>

              <div className='mt-8 pt-6 border-t border-gray-200'>
                <p className='text-xs text-gray-500 text-center'>
                  🔒 Secure authentication powered by Supabase
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Login