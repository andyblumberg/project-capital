import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Login() {
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const defaultSignup = params.get('signup') === '1'
  const [isCreating, setIsCreating] = useState(defaultSignup)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  function updateField(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded shadow p-8">
        {!isCreating ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Sign in to your account</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input name="email" type="email" className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" value={form.email} onChange={updateField} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input name="password" type="password" className="mt-1 block w-full border rounded px-3 py-2" placeholder="••••••" value={form.password} onChange={updateField} />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <button type="button" className="text-sm text-sky-600" onClick={() => alert('Password reset (mock)')}>Forgot?</button>
              </div>
              <div>
                <button type="submit" className="w-full py-2 bg-sky-600 text-white rounded">Sign in</button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <button className="text-sky-600 font-medium" onClick={() => setIsCreating(true)}>Create account</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input name="name" type="text" className="mt-1 block w-full border rounded px-3 py-2" placeholder="Your name" value={form.name} onChange={updateField} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input name="email" type="email" className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" value={form.email} onChange={updateField} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input name="password" type="password" className="mt-1 block w-full border rounded px-3 py-2" placeholder="Create a password" value={form.password} onChange={updateField} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm password</label>
                <input name="confirm" type="password" className="mt-1 block w-full border rounded px-3 py-2" placeholder="Confirm password" value={form.confirm} onChange={updateField} />
              </div>
              <div>
                <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Create account</button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button className="text-sky-600 font-medium" onClick={() => setIsCreating(false)}>Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
