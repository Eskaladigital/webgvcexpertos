import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'Título requerido'),
  slug: z.string().min(1, 'Slug requerido'),
  excerpt: z.string().optional(),
  content: z.string().optional().default('<p></p>'),
  category_id: z.string().optional().nullable(),
  featured_image: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
})

// GET - Listar posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const supabase = getSupabaseAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('posts')
      .select(`
        *,
        category:post_categories(id, name, slug),
        author:team_members(id, name)
      `)
      .order('created_at', { ascending: false })

    if (status === 'published') {
      query = query.eq('is_published', true)
    } else if (status === 'draft') {
      query = query.eq('is_published', false)
    }

    const { data: posts, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      posts: posts || [],
    })
  } catch (error) {
    console.error('Error en GET /api/admin/posts:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener posts' },
      { status: 500 }
    )
  }
}

// POST - Crear post
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const validatedData = postSchema.parse(body)

    // Verificar slug único
    const { data: existing } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', validatedData.slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Ya existe un artículo con ese slug' },
        { status: 400 }
      )
    }

    // Calcular tiempo de lectura
    const wordCount = validatedData.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        ...validatedData,
        category_id: validatedData.category_id || null,
        reading_time: readingTime,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error en POST /api/admin/posts:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear post' },
      { status: 500 }
    )
  }
}
