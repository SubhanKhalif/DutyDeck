import React from 'react'

const Footer = () => (
  <footer className="w-full bg-gray-950/95 backdrop-blur-lg border-t border-gray-800 py-6 mt-16">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300/90">
          &copy; {new Date().getFullYear()} DutyDeck. All rights reserved.
        </span>
        <span className="hidden sm:block text-gray-500">|</span>
        <span className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
          Privacy Policy
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
          Terms of Service
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">
          Crafted with <span className="text-red-400/90">❤️</span> by Sukhankar & Subhan
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
          v1.0.0
        </span>
      </div>
    </div>
  </footer>
)

export default Footer