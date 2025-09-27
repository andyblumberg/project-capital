import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import * as d3 from 'd3'

function App() {
  const chartRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [textValue, setTextValue] = useState('Type notes here...')

  useEffect(() => {
    // createChart mounts SVG into chartRef.current and cleans up on re-run/unmount
    let mounted = true

    async function createChart(container) {
      // remove any previous SVG (prevents duplicates in StrictMode)
      d3.select(container).selectAll('svg').remove()

      const margin = { top: 20, right: 20, bottom: 40, left: 50 }
      const width = Math.max(600, window.innerWidth * 0.6) - margin.left - margin.right
      const height = Math.max(400, window.innerHeight * 0.6) - margin.top - margin.bottom

      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // generate some sample data
      const now = new Date()
      const data = d3.range(50).map((i) => ({
        x: d3.timeDay.offset(now, -50 + i),
        y: Math.sin(i / 5) * 20 + 50 + Math.random() * 10,
      }))

      const x = d3.scaleTime().domain(d3.extent(data, (d) => d.x)).range([0, width])
      const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.y) + 10]).range([height, 0])

      const xAxis = d3.axisBottom(x).ticks(Math.min(10, data.length))
      const yAxis = d3.axisLeft(y)

      svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis)
      svg.append('g').call(yAxis)

      const line = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y))

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2b6cb0')
        .attr('stroke-width', 2)
        .attr('d', line)

      // small responsive behavior: redraw on resize
      function handleResize() {
        if (!mounted) return
        d3.select(container).selectAll('svg').remove()
        createChart(container)
      }

      window.addEventListener('resize', handleResize)

      // cleanup for this chart
      return () => {
        window.removeEventListener('resize', handleResize)
        d3.select(container).selectAll('svg').remove()
      }
    }

    let cleanupFn
    if (chartRef.current) {
      createChart(chartRef.current).then((cleanup) => {
        cleanupFn = cleanup
      })
    }

    return () => {
      mounted = false
      if (cleanupFn) cleanupFn()
      if (chartRef.current) d3.select(chartRef.current).selectAll('svg').remove()
    }
  }, [/* empty -> run on mount */])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-14'} bg-slate-900 text-slate-50 transition-all duration-200 flex flex-col`}>
        <div className="flex justify-end p-2">
          <button className="text-2xl text-slate-200" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            ‹
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">Controls</h3>
          <p className="text-sm text-slate-300">Place filters or settings here.</p>
          <button className="mt-3 px-3 py-2 bg-sky-600 text-white rounded" onClick={() => alert('Example action')}>Action</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-slate-50">
        <header className="flex items-center gap-4 p-4 border-b">
          {!sidebarOpen && (
            <button className="px-3 py-2 bg-sky-700 text-white rounded" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              ☰
            </button>
          )}
          <h1 className="text-xl font-semibold text-slate-800">Large D3 Graph</h1>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl" ref={chartRef} />
        </main>

        <div className="border-t p-4">
          <textarea className="w-full min-h-[120px] p-3 border rounded" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default App
