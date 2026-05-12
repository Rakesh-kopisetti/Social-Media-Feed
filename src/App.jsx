import React, { Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App(){
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200/60">S</div>
            <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-cyan-700 bg-clip-text text-transparent">SocialHub</span>
          </Link>
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors px-4 py-2 rounded-full hover:bg-indigo-50">
            Home
          </Link>
        </div>
      </nav>

      <Suspense fallback={<div className="text-center py-16 text-slate-600"><div className="inline-block"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div></div></div>}>
        <Routes>
          <Route path="/" element={<Feed/>} />
          <Route path="/profile/:userId" element={<Profile/>} />
        </Routes>
      </Suspense>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

