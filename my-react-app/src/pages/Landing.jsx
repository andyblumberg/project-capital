import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/project_capital_v2.png" alt="Project Capital" className="w-12 h-12 object-contain" />
            <span className="font-semibold text-lg">Project Capital</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/home" className="text-slate-700">Demo</Link>
            <Link to="/login" className="px-4 py-2 bg-sky-600 text-white rounded-md">Sign in</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <img src="/project_capital_v2.png" alt="Project Capital" className="mx-auto md:mx-0 w-40 md:w-56 lg:w-72 mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Visualize capital flows. Get actionable insights.</h1>
            <p className="text-lg text-slate-600 mb-6">Project Capital is an interactive analytics demo that combines powerful D3 visualizations with AI-driven insights. Quickly explore data, customize dashboards, and generate narrative summaries.</p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-md shadow">Sign in</Link>
              <Link to="/login?signup=1" className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 rounded-md text-slate-700">Create account</Link>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow">
                <img src="/project_capital_v2.png" alt="Sample 1" className="w-full h-48 object-cover bg-slate-100" />
              </div>
              <div className="rounded-lg overflow-hidden shadow">
                <img src="/project_capital_v2.png" alt="Sample 2" className="w-full h-48 object-cover bg-slate-100" />
              </div>
              <div className="rounded-lg overflow-hidden shadow">
                <img src="/project_capital_v2.png" alt="Sample 3" className="w-full h-48 object-cover bg-slate-100" />
              </div>
              <div className="rounded-lg overflow-hidden shadow">
                <img src="/project_capital_v2.png" alt="Sample 4" className="w-full h-48 object-cover bg-slate-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Interactive charts</h3>
              <p className="text-sm text-slate-600">Pan, zoom and explore large datasets with a responsive D3 visual.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">AI insights</h3>
              <p className="text-sm text-slate-600">Ask questions in plain English and get narrative summaries powered by OpenAI.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Custom dashboards</h3>
              <p className="text-sm text-slate-600">Save views, toggle filters, and share insights with teammates.</p>
            </div>
          </div>
        </section>

        {/* Gallery / sample screenshots */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Sample screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-slate-100 flex items-center justify-center">
                  <img src="/project_capital_v2.png" alt={`Screenshot ${i + 1}`} className="w-24 h-24 opacity-70" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">Screenshot {i + 1}</div>
                  <div className="text-xs text-slate-500">A short caption describing this view.</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
