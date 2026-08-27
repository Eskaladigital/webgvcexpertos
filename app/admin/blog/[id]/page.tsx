'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Sparkles,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [redacting, setRedacting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
    is_featured: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCategories()
    loadPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (data.success) setCategories(data.categories)
    } catch (error) {
      console.error('Error cargando categorías:', error)
    }
  }

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`)
      const data = await response.json()
      if (!data.success || !data.post) {
        router.push('/admin/blog')
        return
      }
      const post = data.post
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category_id: post.category_id || '',
        featured_image: post.featured_image || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        is_published: Boolean(post.is_published),
        is_featured: Boolean(post.is_featured),
      })
    } catch {
      router.push('/admin/blog')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setIsSaving(true)
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio'
    if (!formData.slug.trim()) newErrors.slug = 'El slug es obligatorio'
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSaving(false)
      return
    }

    try {
      const nextPublished = publish ?? formData.is_published
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_published: nextPublished,
        }),
      })
      const data = await response.json()
      if (data.success) {
        router.push('/admin/blog')
      } else {
        setErrors({ submit: data.message || 'Error al guardar' })
      }
    } catch {
      setErrors({ submit: 'Error de conexión' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRedactArticle = async () => {
    if (formData.content && formData.content !== '<p></p>') {
      const ok = window.confirm('Esto reescribirá el contenido en español. El inglés no se toca. ¿Continuar?')
      if (!ok) return
    }
    setRedacting(true)
    setErrors({})
    try {
      const response = await fetch('/api/admin/blog/redact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `No se pudo redactar (${response.status})`)
      }
      setFormData((prev) => ({
        ...prev,
        content: result.content || prev.content,
        excerpt: result.excerpt || prev.excerpt,
        meta_title: result.metaTitle || prev.meta_title,
        meta_description: result.metaDescription || prev.meta_description,
      }))
      alert(`Artículo redactado (${result.wordCount || 0} palabras). Revisa el español; el inglés se traduce después.`)
    } catch (error: unknown) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Error al redactar el artículo',
      })
    } finally {
      setRedacting(false)
    }
  }

  const busy = isSaving || redacting

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Editar artículo</h1>
            <p className="text-gray-600 text-sm">Publicaciones · GVC Expertos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRedactArticle}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white font-medium rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            {redacting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {redacting ? 'Redactando…' : 'Redactar con IA'}
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Guardar borrador
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publicar
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-lg ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={20}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono text-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            <p className="mt-2 text-xs text-gray-500">HTML del cuerpo. Redactar con IA rellena este campo (sin portadas).</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Extracto</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-charcoal mb-4">Publicación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 text-gold rounded"
                />
                <label htmlFor="is_featured" className="text-sm text-gray-700">Artículo destacado</label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-charcoal mb-4">Imagen destacada</h3>
            <input
              type="text"
              value={formData.featured_image}
              onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
              placeholder="/images/blog/imagen.jpg"
            />
            <p className="mt-2 text-xs text-gray-500">Sin generación IA de portadas (web legal).</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-charcoal mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta título</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">{formData.meta_title.length}/60</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta descripción</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">{formData.meta_description.length}/160</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
