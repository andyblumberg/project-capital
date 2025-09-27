import React from 'react'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Sign in to your account</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="mt-1 block w-full border rounded px-3 py-2" placeholder="••••••" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-sm text-sky-600">Forgot?</a>
          </div>
          <div>
            <button type="submit" className="w-full py-2 bg-sky-600 text-white rounded">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}
