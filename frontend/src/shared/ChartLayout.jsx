import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as d3 from 'd3'

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
async function talk_to_gemini(user_question) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const prompt = `Convert the following prompt to a single API call, adhere to this format strictly do not add any extra query parameters. 
  return only the api call and nothing else.

  The available APIs are
    1. http://127.0.0.1:8000/transactions/<category>
      - <user> is the currently logged on user
      - <category> is one of "grocery" or "medical" 

    2. project-capital.com/<user>/account/balance
      - <user> is the currently logged on user

    prompt: `

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt + user_question,
  });
  console.log(response.candidates[0].content.parts[0].text);
  return response.candidates[0].content.parts[0].text;
}

async function call_backend(endpoint) {
  // We are using the JSONPlaceholder API for this example
  const response = await fetch(endpoint);
  
  // Check if the response is successful
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Parse the JSON from the response
  let r = await response.json()
  console.log(r);
  return r
}

export default function ChartLayout() {
  const chartRef = useRef(null)
  const topRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [textValue, setTextValue] = useState('Describe any insights or questions you have about your recent transactions...')
  const [sending, setSending] = useState(false)
  const [reply, setReply] = useState([])

  useEffect(() => {
    const container = chartRef.current
    if (!container) return

    // use ResizeObserver on the chart container so the chart sizes to its available area
    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      drawStackedBarChart(container, rect.width, rect.height)
    })

    ro.observe(container)

    // initial draw
    const rect = container.getBoundingClientRect()
    drawStackedBarChart(container, rect.width, rect.height)

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
            onClick={async () => {
                if (!textValue.trim()) return
                console.log(textValue)
                let res = await talk_to_gemini(textValue)
                setReply(await call_backend(res))
              }}
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
