import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Add API key if required by OpenRouter for this endpoint
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json({ error: 'Failed to fetch models from OpenRouter', details: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
}
