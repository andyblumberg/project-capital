import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const overlayRef = useRef(null)

  // configuration: tweak these to change the behaviour/size/strength of the effect
  const NEAR = 200           // px distance from logo where effect ramps up
  const BASE_GSIZE = 4      // base gradient size (%) when cursor is near
  const EXTRA_GSIZE = 30     // additional gradient size (%) that scales with proximity
  const SCALE_MULT = 0.16    // max additional logo scale (e.g. 0.16 -> +16%)
  const ALPHA_INNER = 0.6    // inner gradient alpha
  const ALPHA_MID = 0.32     // mid gradient alpha
  const ALPHA_OUT = 0.10     // outer gradient alpha

  useEffect(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = '0'

    // track global mouse so the effect continues beyond the main element
    function globalMove(e) {
      onMove(e)
    }
    function globalLeave() {
      onLeave()
    }

    window.addEventListener('mousemove', globalMove)
    window.addEventListener('mouseleave', globalLeave)

    return () => {
      window.removeEventListener('mousemove', globalMove)
      window.removeEventListener('mouseleave', globalLeave)
    }
  }, [])

  function onMove(e) {
    const container = containerRef.current
    const logo = logoRef.current
    const overlay = overlayRef.current
    if (!container || !overlay) return

  // use viewport-relative coordinates so the gradient follows the cursor
  const x = (e.clientX / window.innerWidth) * 100
  const y = (e.clientY / window.innerHeight) * 100

    // distance to logo center
    let dist = Infinity
    if (logo) {
      const lrect = logo.getBoundingClientRect()
      const lx = lrect.left + lrect.width / 2
      const ly = lrect.top + lrect.height / 2
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      dist = Math.sqrt(dx * dx + dy * dy)
    }

    let gsize = 3
    let scale = 1
    if (dist < NEAR) {
      const t = Math.max(0, 1 - dist / NEAR)
      gsize = BASE_GSIZE + t * EXTRA_GSIZE
      scale = 1 + SCALE_MULT * t
    }

  overlay.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(132,204,22,${ALPHA_INNER}) 0%, rgba(132,204,22,${ALPHA_MID}) ${gsize}%, rgba(132,204,22,${ALPHA_OUT}) ${Math.min(100, gsize * 1.8)}%, transparent 100%)`
    overlay.style.opacity = '1'

    if (logo) {
      logo.style.transform = `scale(${scale})`
      logo.style.transition = 'transform 220ms cubic-bezier(.2,.9,.2,1)'
    }
  }

  function onLeave() {
    if (overlayRef.current) overlayRef.current.style.opacity = '0'
    if (logoRef.current) logoRef.current.style.transform = 'scale(1)'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">

      {/* full-viewport overlay sits behind content */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 transition-opacity duration-200 z-0" style={{ mixBlendMode: 'normal' }} />

      {/* sticky navbar with dim lime background */}
      <header className="sticky top-0 z-50 bg-lime-100/90 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/project_capital_v2.png" alt="Project Capital" className="w-8 h-8 object-contain" />
            <span className="text-sm font-semibold text-slate-900">Project Capital</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/home" className="text-slate-700 hover:text-slate-900">Demo</Link>
            <Link to="/login" className="px-3 py-1 rounded text-sm bg-lime-600 text-white hover:bg-lime-700">Sign in</Link>
          </nav>
        </div>
      </header>

      <main ref={containerRef} className="w-full max-w-3xl px-6 py-24 mx-auto text-center relative z-10">

        <img
          ref={logoRef}
          src="/project_capital_v2.png"
          alt="Project Capital"
          className="mx-auto w-64 h-64 md:w-80 md:h-80 object-contain relative z-10"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Project Capital</h1>
        <p className="text-lg md:text-xl font-semibold text-slate-700 mb-8">Visualize capital flows and get actionable, AI-powered insights.</p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 rounded-md bg-gradient-to-r from-lime-500 to-lime-600 text-white font-medium shadow-lg transform transition hover:-translate-y-0.5 hover:scale-[1.03] focus:outline-none"
          >
            Sign in
          </Link>
          <Link to="/login?signup=1" className="inline-flex items-center px-6 py-3 rounded-md border border-lime-600 text-lime-700 font-medium hover:bg-lime-50">Create account</Link>
        </div>

      </main>
    </div>
  )
}
