import React from 'react'
import { Building2, Globe, Users, Award, Sparkles, TrendingUp, Shield } from 'lucide-react'


const PageHeader = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_60%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-8 border border-yellow-400/30 shadow-md shadow-yellow-500/20">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400 animate-spin-slow" />
            Trusted Manufacturing Partners
            <div className="ml-2 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Discover Our{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Manufacturing
            </span>{' '}
            Network
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-14 leading-relaxed max-w-3xl mx-auto">
            Connect with world-class manufacturers specializing in premium stone products and architectural solutions
          </p>
          
          {/* Additional Features */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <span className="font-medium">Quality Assured</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <span className="font-medium">Growing Network</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition">
              <Building2 className="w-5 h-5 text-purple-400 mr-2" />
              <span className="font-medium">Verified Partners</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-100 via-blue-50 to-transparent"></div>
    </div>
  )
}

export default PageHeader
