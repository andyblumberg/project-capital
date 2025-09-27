import React from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div>
            <Link to="/" className="inline-flex items-center p-2 rounded hover:bg-slate-100">
              <img src="/home.svg" alt="Home" className="w-6 h-6" />
            </Link>
          </div>
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-slate-500">AB</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Andy Blumberg</h2>
            <div className="text-sm text-slate-600">andy@example.com</div>
          </div>
          <div className="ml-auto">
            <Link to="/login" className="px-4 py-2 bg-sky-600 text-white rounded">Sign out</Link>
          </div>
        </div>

        <section className="mb-6">
          <h3 className="font-semibold mb-2">Bank accounts</h3>
          <p className="text-sm text-slate-500 mb-4">Add or switch between your linked bank accounts. (Non-functional mock)</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Checking •••• 1234</div>
                  <div className="text-sm text-slate-500">Bank of Demo</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$4,321.00</div>
                  <button className="mt-2 px-3 py-1 border rounded text-sm">Make active</button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Savings •••• 9876</div>
                  <div className="text-sm text-slate-500">Demo Savings</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$12,345.67</div>
                  <button className="mt-2 px-3 py-1 border rounded text-sm">Make active</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 bg-white border rounded">Add bank account</button>
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Profile details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <div className="text-sm text-slate-500">Name</div>
              <div className="font-medium">Andy Blumberg</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-slate-500">Email</div>
              <div className="font-medium">andy@example.com</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
