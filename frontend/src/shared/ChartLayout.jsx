import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as d3 from 'd3'

export default function ChartLayout() {
  const chartRef = useRef(null)
  const topRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [textValue, setTextValue] = useState('Describe any insights or questions you have about your recent transactions...')
  const [sending, setSending] = useState(false)
  const [reply, setReply] = useState('')

  // handler for sending the textarea content to the backend
  async function handleAsk() {
    if (!textValue.trim()) return
    setSending(true)
    setReply('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textValue }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setReply('Error: ' + (err.error || err.detail || 'unknown'))
      } else {
        const data = await res.json()
        setReply(data.reply || '')
      }
    } catch (err) {
      setReply('Network error: ' + String(err))
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const container = chartRef.current
    if (!container) return

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }

    function draw(widthPx, heightPx) {
      d3.select(container).selectAll('svg').remove()

      const width = Math.max(200, widthPx) - margin.left - margin.right
      const height = Math.max(150, heightPx) - margin.top - margin.bottom

      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // sample data
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
    }

    // use ResizeObserver on the chart container so the chart sizes to its available area
    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      draw(rect.width, rect.height)
    })

    ro.observe(container)

    // initial draw
    const rect = container.getBoundingClientRect()
    draw(rect.width, rect.height)

    return () => {
      ro.disconnect()
      d3.select(container).selectAll('svg').remove()
    }
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-2 py-2 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/project_capital_v2.png" alt="logo" className="w-10 h-10 object-contain" />
            <span className="text-sm font-semibold">Project Capital</span>
          </Link>
          <div className="ml-auto">
            <Link to="/profile" className="inline-flex items-center">
              <img src="/user.svg" alt="Profile" className="w-9 h-9 rounded-full bg-slate-200 p-1" />
            </Link>
          </div>
        </div>
      </header>

      <div ref={topRef} className="flex-1 flex items-stretch p-6 min-h-0">
        {/* right sidebar removed to keep layout single-column width */}

        
        <aside className={`${sidebarOpen ? 'w-80' : 'w-14'} mr-6 transition-all duration-200 bg-slate-50 text-slate-900 rounded shadow-sm flex flex-col` }>
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">Transactions</h2>
            </div>
            <button
              className="text-xl text-slate-600 px-2"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? '<' : '>'}
            </button>
          </div>

          {sidebarOpen ? (
            <div className="p-3 overflow-auto flex-1">
              {/* sample transactions */}
              {[
                { merchant: 'Starbucks', date: new Date(), amount: -4.75 },
                { merchant: 'Acme Grocery', date: new Date(Date.now() - 86400000 * 1), amount: -42.12 },
                { merchant: 'Payroll', date: new Date(Date.now() - 86400000 * 2), amount: 2500.0 },
                { merchant: 'Uber', date: new Date(Date.now() - 86400000 * 3), amount: -12.3 },
                { merchant: 'Apple', date: new Date(Date.now() - 86400000 * 4), amount: -199.0 },
                { merchant: 'Interest', date: new Date(Date.now() - 86400000 * 5), amount: 3.21 },
                { merchant: 'Electric Co.', date: new Date(Date.now() - 86400000 * 6), amount: -89.45 },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{t.merchant}</div>
                    <div className="text-xs text-slate-500">{t.date.toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.amount >= 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-2 flex items-center justify-center text-xs text-slate-600 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => setSidebarOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSidebarOpen(true) }}
            >
              Open
            </div>
          )}
        </aside>

        <div className="flex-1 flex items-center justify-center min-h-0">
          {/* chart container: full height of top area, will be observed for sizing */}
          <div className="w-full max-w-6xl h-full min-h-0" ref={chartRef} />
        </div>

      </div>

      

      <div className="border-t p-4" style={{ height: 160 }}>
        <div className="h-full relative">
          <textarea
            className="w-full h-full p-3 border rounded resize-none pr-16"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            disabled={sending}
            aria-label="Notes input"
          />

          <button
            onClick={handleAsk}
            disabled={sending}
            aria-label="Send"
            className={`absolute right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${sending ? 'opacity-60 pointer-events-none' : 'bg-sky-600 text-white'}`}
          >
            <img src="/arrow-right.svg" alt="Send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
