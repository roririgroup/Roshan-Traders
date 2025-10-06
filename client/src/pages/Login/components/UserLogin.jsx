import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { loginUser, isAuthenticated } from '../../../lib/auth'
import Button from '../../../components/ui/Button'

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { truck3, white } from '../../../../public/lottie/lottie';
import { User, Factory, Wrench, Phone, Key, Loader2, Truck } from 'lucide-react'

export default function UserLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [userType, setUserType] = useState('agent')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(e) {
  e.preventDefault()
  if (!phone || !otp) {
    setError('Please enter both mobile number and OTP')
    return
  }

  setIsLoading(true)
  setError('')

  const res = loginUser({ phone, otp, userType })
  if (!res.success) {
    setError(res.error || 'Login failed')
    setIsLoading(false)
    return
  }

  // Redirect based on userType
  if (userType === 'agent') {
    navigate('/agents/dashboard')
  } else if (userType === 'manufacturer') {
    navigate('/manufacturers')
  } else if (userType === 'truckOwner') {
    navigate('/truck owners')
  } else if (userType === 'driver') {
    navigate('/drivers')
  } else {
    navigate('/')
  }
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative ">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 w-200">
        <div className="flex rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="flex flex-col justify-between rounded-l-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
            
              <div className="items-center gap- mt-10 ml-5">
                <img src={white} alt="Roshan Traders" className="h-13 w-35" />
              </div>
              <DotLottieReact src={truck3} loop autoplay style={{ width: 260, height: 260 }} />
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-6 ">
              <h1 className="text-2xl font-semibold tracking-tight  text-center mr-3">User Login</h1>
              <p className="mt-1 text-sm text-gray-600  ml-23">Sign in with your mobile number and OTP</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div>
              <div className="grid grid-cols-4 gap-2 ml-25 ">
                {[
                  { value: 'agent', label: 'Agent', icon: <User className="w-4 h-4" /> },
                  { value: 'manufacturer', label: 'Manufacturer', icon: <Factory className="w-4 h-4" /> },
                  { value: 'truckOwner', label: 'Truck Owner', icon: <Truck className="w-4 h-4" /> },
                  { value: 'driver', label: 'Driver', icon: <Wrench className="w-4 h-4" /> }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUserType(type.value)}
                    className={`py-2 px-3 cursor-pointer rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors ${userType === type.value
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
                <div className="relative flex rounded-xl border bg-white focus-within:ring-2 focus-within:ring-indigo-200">
                  <span className="px-3 inline-flex items-center text-gray-500 border-r select-none">+91</span>
                  <Phone className="absolute left-16 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-40 pl-12 pr-3 py-2 rounded-r-xl outline-none placeholder:text-gray-400 "
                    placeholder="98765 43210"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl border pl-10 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-400"
                    placeholder="Enter OTP (any 4+ digits)"
                    required
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-[15px] flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing you agree to our <span className="underline underline-offset-2 ">Terms</span> and <span className="underline underline-offset-2">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}