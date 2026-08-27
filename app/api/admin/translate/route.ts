import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { content, from, to, contentType } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Determinar el prompt según el tipo de contenido
    const systemPrompt = getSystemPrompt(contentType, from, to)

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.6-terra',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content,
        },
      ],
      max_completion_tokens: 4000,
    })

    const translation = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    )
  }
}

function getSystemPrompt(contentType: string, from: string, to: string): string {
  const targetLanguage = to === 'en' ? 'English' : 'Spanish'
  const sourceLanguage = from === 'es' ? 'Spanish' : 'English'

  const basePrompt = `You are a professional translator specializing in legal and medical content. Translate the following ${sourceLanguage} text to ${targetLanguage}.`

  const contentSpecificInstructions: Record<string, string> = {
    title: `
${basePrompt}
- Keep it concise and impactful
- Maintain SEO keywords when possible
- Use professional legal terminology
- Return ONLY the translated title, no explanations`,

    excerpt: `
${basePrompt}
- Maintain the same length approximately
- Keep the same tone and style
- Ensure it's compelling for readers
- Return ONLY the translated excerpt, no explanations`,

    content: `
${basePrompt}
- Preserve all HTML tags exactly as they are
- Translate only the text content, not HTML attributes
- Maintain legal and medical terminology accuracy
- Keep the same structure and formatting
- Use professional language appropriate for a law firm
- Return ONLY the translated HTML content, no explanations`,

    meta_description: `
${basePrompt}
- Keep it under 160 characters
- Make it SEO-optimized
- Include relevant keywords
- Make it compelling for search results
- Return ONLY the translated meta description, no explanations`,

    default: `
${basePrompt}
- Maintain professional tone
- Use appropriate legal/medical terminology
- Preserve the original meaning accurately
- Return ONLY the translation, no explanations`,
  }

  return contentSpecificInstructions[contentType] || contentSpecificInstructions.default
}



