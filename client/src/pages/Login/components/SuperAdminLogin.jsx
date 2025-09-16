import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { loginSuperAdmin, isAuthenticated } from '../../../lib/auth'
import Button from '../../../components/ui/Button'
import logo from "../../../assets/Roshan logo/Roshan_white.png";

export default function SuperAdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = loginSuperAdmin({ email, password })
    if (!res.success) {
      setError(res.error || 'Login failed')
      setIsLoading(false)
      return
    }
    navigate('/')
  }

  function handleGoogleLogin() {
    setIsLoading(true)
    setError('')
    
    const res = loginSuperAdmin({ email: 'admin@roshantraders.com', password: 'google-oauth' })
    if (!res.success) {
      setError('Google authentication failed')
      setIsLoading(false)
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl"></div>
      </div>
      
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
            <div>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Roshan Traders" className="h-10 w-30" />
              </div>
              <h2 className="mt-10 text-2xl font-semibold leading-snug">Marketplace + Workforce Platform</h2>
              <p className="mt-2 text-white/80 text-sm">IndiaMART for suppliers. Amazon for customers. One dashboard for operations.</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white"></span> OTP login for all roles</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white"></span> Orders, jobs, tracking, and payments</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white"></span> Referral growth engine</li>
              </ul>
            </div>
            <div className="text-xs text-white/80">
              © {new Date().getFullYear()} Roshan Traders. All rights reserved.
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Super Admin Login</h1>
              <p className="mt-1 text-sm text-gray-600">Sign in with your Gmail account or email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-400"
                  placeholder="admin@roshantraders.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl text-[15px]"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-11 rounded-xl text-[15px] mt-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </div>
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing you agree to our <span className="underline underline-offset-2">Terms</span> and <span className="underline underline-offset-2">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}