import React from 'react'
import { ArrowRight, MessageCircle, Phone, Mail, Sparkles } from 'lucide-react'

const CallToAction = () => {
  const handleGetQuote = () => {
    console.log('Get Custom Quote clicked')
  }

  
  const handleContact = (method) => {
    console.log(`Contact via ${method}`)
  }

  return (
    <div className="mt-20">
      {/* Main CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-12 text-white shadow-2xl">
        
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-500" />
        
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/30 shadow-md animate-bounce">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            Ready to Get Started?
          </div>
          
          {/* Heading */}
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Looking for <span className="text-yellow-300">Custom Solutions?</span>
          </h3>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect directly with our manufacturing partners for bespoke stone products and architectural solutions 
            <span className="text-yellow-200"> tailored to your specific requirements.</span>
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
            <button 
              onClick={handleGetQuote}
              className="group bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl flex items-center"
            >
              Get Custom Quote
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button 
              onClick={() => handleContact('call')}
              className="group bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 border border-white/40 flex items-center shadow-md"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </button>
          </div>
          
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <MessageCircle className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-lg">Live Chat</h4>
              <p className="text-white/70 text-sm">Get instant answers</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <Mail className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-lg">Email Us</h4>
              <p className="text-white/70 text-sm">Detailed inquiries</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <Phone className="w-10 h-10 text-purple-300 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-lg">Phone Support</h4>
              <p className="text-white/70 text-sm">Direct consultation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToAction
