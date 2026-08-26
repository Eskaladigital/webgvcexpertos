import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path, tag } = body

    // Verificar secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidar por path o tag
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        revalidated: true,
        path,
        now: Date.now(),
      })
    }

    if (tag) {
      revalidateTag(tag, 'max')
      return NextResponse.json({
        success: true,
        revalidated: true,
        tag,
        now: Date.now(),
      })
    }

    return NextResponse.json(
      { success: false, message: 'Path or tag required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error en /api/revalidate:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
