import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* <nav className="p-3 border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="font-semibold">Landing</Link>
          <Link to="/home" className="text-slate-700">Demo</Link>
          <Link to="/profile" className="text-slate-700">Profile</Link>
          <Link to="/login" className="text-slate-600">Login</Link>
        </div>
      </nav> */}

      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}
