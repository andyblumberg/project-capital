import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { GoogleGenAI } from "@google/genai";


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
  const [textValue, setTextValue] = useState('Type notes here...')
  const [sending, setSending] = useState(false)
  const [reply, setReply] = useState([])

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
      let data = []
      if (reply.length == 0) {
        data = d3.range(50).map((i) => ({
          x: 0,
          y: 0,
        }))
      } else {
        console.log("I hit this")
        var parseTime = d3.timeParse("%Y-%m-%d");
        reply.forEach((d) => data.push({
          x: parseTime(d.date),
          y: +d.close,
        }))
        console.log(data)
      }

      var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => { return d.x; }));
    y.domain([0, d3.max(data, (d) => { return d.y; })]);

      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      svg.append('g').call(d3.axisLeft(y))

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
  }, [reply])

  return (
    <div className="flex flex-col h-full overflow-hidden">

    <div ref={topRef} className="flex-1 flex items-stretch p-6 min-h-0">
        {/* right sidebar removed to keep layout single-column width */}

        
        <aside className={`${sidebarOpen ? 'w-72' : 'w-14'} mr-6 transition-all duration-200 bg-slate-900 text-slate-50 rounded`}>
          <div className="flex justify-end p-2">
            <button
              className="text-2xl text-slate-200"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? '‹' : '›'}
            </button>
          </div>
          {sidebarOpen && (
            <div className="p-4">
              <h3 className="text-lg font-semibold">Controls</h3>
              <p className="text-sm text-slate-300">Place filters or settings here.</p>
              <button className="mt-3 px-3 py-2 bg-sky-600 text-white rounded" onClick={() => alert('Example action')}>Action</button>
            </div>
          )}
        </aside>

        <div className="flex-1 flex items-center justify-center min-h-0">
          {/* chart container: full height of top area, will be observed for sizing */}
          <div className="w-full max-w-6xl h-full min-h-0" ref={chartRef} />
        </div>

        <aside className={`${sidebarOpen ? 'w-72' : 'w-14'} mr-6 transition-all duration-200 bg-slate-900 text-slate-50 rounded`}>
          <div className="flex justify-end p-2">
            <button
              className="text-2xl text-slate-200"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? '‹' : '›'}
            </button>
          </div>
          {sidebarOpen && (
            <div className="p-4">
              <h3 className="text-lg font-semibold">Controls</h3>
              <p className="text-sm text-slate-300">Place filters or settings here.</p>
              <button className="mt-3 px-3 py-2 bg-sky-600 text-white rounded" onClick={() => alert('Example action')}>Action</button>
            </div>
          )}
        </aside>

      </div>

      

      <div className="border-t p-4" style={{height: 160}}>
        <div className="flex gap-3 h-full">
          <textarea
            className="flex-1 h-full p-3 border rounded resize-none"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            disabled={sending}
          />
          <div className="w-48 flex flex-col gap-2">
            <button
              className="px-3 py-2 bg-sky-600 text-white rounded"
              onClick={async () => {
                if (!textValue.trim()) return
                console.log(textValue)
                let res = await talk_to_gemini(textValue)
                setReply(await call_backend(res))
              }}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Ask'}
            </button>
            <button
              className="px-3 py-2 bg-gray-200 rounded"
              onClick={() => {
                setTextValue('')
                setReply('')
              }}
              disabled={sending}
            >
              Clear
            </button>
            {/* <div className="flex-1 overflow-auto bg-white p-2 border rounded">
              <strong className="block mb-1">Assistant</strong>
              <div className="text-sm whitespace-pre-wrap">{reply || <span className="text-slate-400">No response yet.</span>}</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
