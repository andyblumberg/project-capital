import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as d3 from 'd3'
import { GoogleGenAI } from "@google/genai";
import ClipLoader from "react-spinners/ClipLoader";

import { drawStackedBarChart, drawLineChart, drawPieChart } from './utils';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
async function talk_to_gemini(user_question) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const prompt = `Pick on of the following API interfaces and return an API call for the prompt provided below, adhere to this format strictly do not add any extra query parameters. 
  return only the api call and nothing else.

  The available APIs are
    1. http://127.0.0.1:8000/100001/spending/selectcategories?[categories=<category>]&start_date=<1>&end_date=<2>
      - This api call is for obtaining the TOTAL PER CATEGORY EXPENDITURE for a specified number of categories within a given date range
      - [categories=<category>] should be replaced with a & seperated categories=<K> where K can be one of food, entertainment, utilities, transportation, shopping, miscellaneous, housing, education, healthcare
      - <1> should be the start date in YYYY-MM-DD, if this isnt available in prompt assume 2027-01-01
      - <2> should be the end date in YYYY-MM-DD, if this isnt available in prompt assume 2027-12-31

    2. http://127.0.0.1:8000/100001/spending/category/selectcategories/cummulative?[categories=<category>]&start_date=<1>&end_date=<2>
      - This api call is for obtaining the PER DAY PER CATEGORY EXPENDITURE for a specified number of categories within a given date range
      - [categories=<category>] should be replaced with a & seperated categories=<K> where K can be one of food, entertainment, utilities, transportation, shopping, miscellaneous, housing, education, healthcare.
      - <1> should be the start date in YYYY-MM-DD, if this isnt available in prompt assume 2027-01-01
      - <2> should be the end date in YYYY-MM-DD, if this isnt available in prompt assume 2027-12-31

    4. http://127.0.0.1:8000/100001/spending/category/cummulative?[categories=<category>]&start_date=<1>&end_date=<2>
      - This api call is for obtaining THE TOTAL COMBINED PER DAY EXPENDITURE for a specified number of categories within a given date range
      - [categories=<category>] should be replaced with a & seperated categories=<K> where K can be one of food, entertainment, utilities, transportation, shopping, miscellaneous, housing, education, healthcare. Defaults to all of the categories.
      - <1> should be the start date in YYYY-MM-DD, if this isnt available in prompt assume 2027-01-01
      - <2> should be the end date in YYYY-MM-DD, if this isnt available in prompt assume 2027-12-31

    prompt: `

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt + user_question,
  });
  console.log("Gemini response: " + response.candidates[0].content.parts[0].text);
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
  console.log("Backend response: " + r);
  return r
}

function pick_chart_type(endpoint) {
  const res = endpoint.split('?')
  console.log(res)
  if (res[0] === "http://127.0.0.1:8000/100001/spending/selectcategories")
    return 'pie'
  else if(res[0] === "http://127.0.0.1:8000/100001/spending/category/selectcategories/cummulative")
    return 'bar'
  else if(res[0] === "http://127.0.0.1:8000/100001/spending/category/cummulative")
    return 'line'
  else
    return ''
}

export default function ChartLayout() {
  const chartRef = useRef(null)
  const topRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [textValue, setTextValue] = useState('')
  const [queried, setQueried] = useState('')
  const [sending, setSending] = useState(false)
  const [reply, setReply] = useState([])
  const [chartType, setChartType] = useState('')

  useEffect(() => {
    const container = chartRef.current
    if (!container) return

    if(reply.length == 0 || chartType.length == 0)
        return

    // use ResizeObserver on the chart container so the chart sizes to its available area
    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      
      if (chartType === 'line')
        drawLineChart(container, rect.width, rect.height, reply)
      else if (chartType === 'pie')
        drawPieChart(container, rect.width, rect.height, reply)
      else
        drawStackedBarChart(container, rect.width, rect.height, reply)
    })

    ro.observe(container)

    // initial draw
    const rect = container.getBoundingClientRect()
    if (chartType === 'line')
        drawLineChart(container, rect.width, rect.height, reply)
      else if (chartType === 'pie')
        drawPieChart(container, rect.width, rect.height, reply)
      else
        drawStackedBarChart(container, rect.width, rect.height, reply)

    return () => {
      ro.disconnect()
      d3.select(container).selectAll('svg').remove()
    }
  }, [reply]);

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
              <h2 className="text-sm font-semibold">{sidebarOpen ? 'Transactions' : ''}</h2>
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
            <div></div>
          )}
        </aside>
        
        <div className="flex-col flex-1 items-center justify-center w-full max-w-6xl">
          {queried? (<div className="w-full max-w-6xl"><span>{queried} {"    "}  <ClipLoader
        loading={sending}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      /></span></div>) : <div></div>}
          {/* chart container: full height of top area, will be observed for sizing */}
          
        <div className="w-full max-w-6xl h-full min-h-0" ref={chartRef} />
          
        </div>
          
      </div>

      <div>
      </div>

      

      <div className="border-t p-4" style={{ height: 160 }}>
        <div className="h-full relative">
          <textarea
            className="w-full h-full p-3 border rounded resize-none pr-16"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            disabled={sending}
            aria-label="Notes input"
            placeholder='Describe any insights or questions you have about your recent transactions...'
          />

          <button
            onClick={async () => {
                if (!textValue.trim()) return
                setSending(true)
                setQueried(textValue)
                setTextValue('')
                let res = await talk_to_gemini(textValue)
                setChartType(pick_chart_type(res))
                setReply(await call_backend(res))
                setSending(false)
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
