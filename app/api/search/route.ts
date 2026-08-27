import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
      })
    }

    const searchTerm = `%${query}%`

    // Buscar en posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt')
      .eq('is_published', true)
      .lte('published_at', new Date().toISOString())
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(5)

    // Buscar en noticias
    const { data: news } = await supabase
      .from('news')
      .select('id, slug, title, excerpt')
      .eq('is_published', true)
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(5)

    const results = [
      ...(posts || []).map((p) => ({ ...p, type: 'post' as const })),
      ...(news || []).map((n) => ({ ...n, type: 'news' as const })),
    ].slice(0, 10)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Error en búsqueda:', error)
    return NextResponse.json(
      { success: false, message: 'Error en la búsqueda' },
      { status: 500 }
    )
  }
}
