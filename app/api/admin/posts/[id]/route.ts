import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// GET - Obtener post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const supabase = getSupabaseAdmin()

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:post_categories(id, name, slug),
        author:team_members(id, name)
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Error en GET /api/admin/posts/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener post' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    // Si se está publicando, añadir fecha de publicación
    if (body.is_published === true) {
      const { data: existing } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', id)
        .single()

      if (!existing?.published_at) {
        body.published_at = new Date().toISOString()
      }
    }

    // Recalcular tiempo de lectura si se actualiza el contenido
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length
      body.reading_time = Math.ceil(wordCount / 200)
    }

    const { data: post, error } = await supabase
      .from('posts')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Error en PATCH /api/admin/posts/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar post' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/posts/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar post' },
      { status: 500 }
    )
  }
}
