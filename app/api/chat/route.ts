import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAllProducts } from '@/lib/products'

const GPT_MODEL = process.env.GPT_MODEL || "gpt-3.5-turbo"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[API] OpenAI API Key is missing')
      return NextResponse.json(
        { success: false, error: 'AI Assistant currently unavailable' },
        { status: 503 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // Get current products for context
    const products = getAllProducts()
    const productsContext = products && products.length > 0
      ? products.map(p => `- ${p.name}: ${p.category} ($${p.price})`).join('\n')
      : "No products currently available."

    console.log(`[API] AI Request: ${GPT_MODEL}`);

    const completion = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a luxury fashion assistant for Butterfly Couture. 
          Our brand is elegant, sophisticated, and premium.
          Treat users with high-end hospitality.
          
          Our Shipping Policy: Free shipping on orders over $500. Standard shipping is $20. Expedited is $10 for orders over $200.
          Our Return Policy: 30 days for unworn items in original condition.
          
          Here are some of our current products for reference:
          ${productsContext}
          
          If a user asks about products, recommend something specific from the list above. 
          Keep responses concise but polite and premium.`
        },
        ...history.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const responseContent = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. How else can I help you?"

    return NextResponse.json({
      success: true,
      data: {
        message: responseContent,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[API] Chat error:', {
      message: error.message,
      status: error.status,
      code: error.code
    })
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process message' 
      },
      { status: error.status || 500 }
    )
  }
}
