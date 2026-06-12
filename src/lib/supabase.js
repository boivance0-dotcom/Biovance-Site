import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Runtime logging for debugging
console.log('🔍 Checking Supabase env vars...')
console.log('URL exists:', !!SUPABASE_URL)
console.log('KEY exists:', !!SUPABASE_KEY)
console.log('URL value:', SUPABASE_URL ? SUPABASE_URL.substring(0, 20) + '...' : 'undefined')
console.log('KEY value:', SUPABASE_KEY ? SUPABASE_KEY.substring(0, 20) + '...' : 'undefined')

let supabase

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Supabase environment variables are missing. Check your .env file and Cloudflare Pages environment variables.")
  console.error("Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY")
  console.error("Make sure they start with VITE_ and are added to Cloudflare Pages → Settings → Environment Variables")

  // Create a dummy client to prevent crash
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({ order: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  }
} else {
   supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
     auth: {
       persistSession: true,
       autoRefreshToken: true
     },
     global: {
       headers: {
         'X-Client-Info': 'biovance-admin-panel'
       }
     }
   })
   console.log("✅ Supabase connected successfully")
   console.log("🔗 Project URL:", SUPABASE_URL)
   console.log("🌍 Region: ap-southeast-2 (Sydney)")

   // Test connection
   supabase.auth.getSession().then(({ data, error }) => {
     if (error) {
       console.error('❌ Supabase connection test failed:', error)
     } else {
       console.log('✅ Supabase connection test passed')
     }
   })
 }

export { supabase }