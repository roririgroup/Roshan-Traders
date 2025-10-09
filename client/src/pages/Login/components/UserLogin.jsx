import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { loginUser, isAuthenticated } from '../../../lib/auth'
import Button from '../../../components/ui/Button'

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { truck3, white } from '../../../../public/lottie/lottie';
import { User, Factory, Wrench, Phone, Key, Loader2, Truck } from 'lucide-react'

export default function UserLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('9876543210') // Default phone number
  const [otp, setOtp] = useState('1234') // Default OTP
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

    // Direct login without any verification
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
      navigate('/manufacturers/dashboard')
    } else if (userType === 'truckOwner') {
      navigate('/truck-owners/dashboard')
    } else if (userType === 'driver') {
      navigate('/drivers/dashboard')
    } else {
      navigate('/')
    }
  }

  const handleSignUp = () => {
    navigate('/signup')
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
              <h1 className="text-2xl font-semibold tracking-tight text-center mr-3">User Login</h1>
              <p className="mt-1 text-sm text-gray-600 text-center">Use default credentials to login instantly</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
  {[
    { value: 'agent', label: 'Agent', icon: <User className="w-5 h-5" /> },
    { value: 'manufacturer', label: 'Manufacturer', icon: <Factory className="w-5 h-5" /> },
    { value: 'truckOwner', label: 'Truck Owner', icon: <Truck className="w-5 h-5" /> },
    { value: 'driver', label: 'Driver', icon: <Wrench className="w-5 h-5" /> }
  ].map((type) => (
    <button
      key={type.value}
      type="button"
      onClick={() => setUserType(type.value)}
      className={`flex flex-col items-center justify-center h-16 w-24 rounded-xl border text-sm font-medium transition-all ${
        userType === type.value
          ? 'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {type.icon}
        <span>{type.label}</span>
      </div>
    </button>
  ))}
</div>

                <div className="grid grid-cols-4 gap-2">
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
                      className={`py-2 px-3 cursor-pointer rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                        userType === type.value
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
                    className="w-full pl-12 pr-3 py-2 rounded-r-xl outline-none placeholder:text-gray-400"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Default: 9876543210
                </p>
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
                    placeholder="Enter OTP"
                    required
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Default: 1234 (or any OTP will work)
                </p>
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
                {isLoading ? 'Logging in...' : 'Login Instantly'}
              </Button>

              <div className="mt-6 text-center text-sm">
                <p>
                  Not a member?{" "}
                  <button 
                    type="button"
                    onClick={handleSignUp}
                    className="text-indigo-600 font-semibold hover:underline hover:text-indigo-700 cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  For demo purposes, you can login with any credentials
                </p>
              </div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                <strong>Demo Instructions:</strong> Just click "Login Instantly" with default values or enter any phone number and OTP
              </p>
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