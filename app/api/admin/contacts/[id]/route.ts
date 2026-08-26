import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// PATCH - Actualizar contacto
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const { data: contact, error } = await supabase
      .from('contact_submissions')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      contact,
    })
  } catch (error) {
    console.error('Error en PATCH /api/admin/contacts/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/contacts/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
