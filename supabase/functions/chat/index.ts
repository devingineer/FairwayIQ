const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, sessions } = await req.json()

    const systemPrompt = `You are an expert golf practice coach embedded in FairwayIQ. Analyse the user's logged session data and give personalised, actionable advice. Be encouraging and specific to their data. Keep responses concise (2-4 sentences) unless the user asks for detail.

${buildSessionSummary(sessions)}`

    const apiKey = Deno.env.get('GEMINI_API_KEY') ?? ''
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const geminiMessages = messages.map((m: { role: string; content: string }, i: number) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: i === 0 ? `${systemPrompt}\n\n${m.content}` : m.content }],
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: geminiMessages }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Gemini API error ${response.status}: ${JSON.stringify(data)}`)
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildSessionSummary(sessions: Array<Record<string, unknown>>) {
  if (!sessions?.length) {
    return "The user has no practice sessions logged yet. Encourage them to log their first session."
  }

  const totalBalls = sessions.reduce((sum, s) => sum + (s.balls as number), 0)
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration as number), 0)

  const clubCounts: Record<string, number> = {}
  sessions.forEach(s => {
    (s.clubs as string[] | null)?.forEach(club => {
      clubCounts[club] = (clubCounts[club] ?? 0) + 1
    })
  })
  const topClubs = Object.entries(clubCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([club, count]) => `${club} (${count}x)`)
    .join(', ')

  const recent = sessions.slice(0, 5).map(s => {
    const clubs = (s.clubs as string[])?.join(', ') || 'unspecified'
    const notes = s.notes ? ` — "${s.notes}"` : ''
    return `• ${s.date}: ${s.balls} balls, ${s.duration} min, clubs: ${clubs}${notes}`
  }).join('\n')

  return `User's practice data:
- Total sessions: ${sessions.length}
- Total balls hit: ${totalBalls}
- Total practice time: ${Math.round(totalMinutes / 60)} hours
- Most practiced clubs: ${topClubs || 'none recorded'}
- Recent sessions:
${recent}`
}
