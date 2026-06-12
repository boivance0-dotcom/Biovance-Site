import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/';
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn();
      navigate(next);
    }, 600);
  };

  return (
    <div className="relative z-10 min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        <div className="hero-gradient-top" />
        <div className="hero-gradient-bottom" />
        <div className="hero-vignette" />

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-md mx-auto page-enter">
            <div className="rounded-2xl p-6 md:p-8 bg-[rgba(7,16,12,0.7)] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <h1 className="text-white font-extrabold leading-tight text-center" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>Welcome back</h1>
              <p className="text-white/80 text-center mt-2">Sign in to continue</p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-white/85 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md bg-black/40 text-white placeholder:text-white/50 border border-white/15 px-3 py-2 outline-none focus:border-[var(--accent,#86C232)] focus:ring-1 focus:ring-[var(--accent,#86C232)]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm text-white/85 mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md bg-black/40 text-white placeholder:text-white/50 border border-white/15 px-3 py-2 outline-none focus:border-[var(--accent,#86C232)] focus:ring-1 focus:ring-[var(--accent,#86C232)]"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/75">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/30 bg-black/30" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/" className="hover:underline">Forgot password?</Link>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-[var(--accent,#86C232)] hover:opacity-90 text-black font-semibold">
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>

                <p className="text-white/70 text-xs text-center mt-2">
                  Don’t have an account? <Link to="/" className="text-white hover:underline">Go home</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;