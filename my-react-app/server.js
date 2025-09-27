const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. /api/generate will fail without it.')
}

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt is required' })

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
      }),
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(502).json({ error: 'OpenAI error', detail: text })
    }

    const data = await r.json()
    const reply = data.choices?.[0]?.message?.content || ''
    res.json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`OpenAI proxy running on http://localhost:${port}`))
