import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, Linkedin, Twitter, Facebook } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaDark } from '@/components/home'
import { siteConfig } from '@/config/site'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'

// ============================================
// PÁGINAS ESTÁTICAS - Se generan durante el build
// ============================================

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('❌ Supabase credentials missing during build')
    return null
  }
  return createClient(url, key)
}

// Obtener todos los posts para generar las páginas estáticas
async function getAllPosts() {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id, slug, title, title_en, excerpt, excerpt_en, content, content_en,
      featured_image, reading_time, published_at, meta_title, meta_title_en,
      meta_description, meta_description_en, category_id,
      category:post_categories(id, name, name_en, slug),
      author:team_members(name, photo_url, position, bio)
    `)
    .eq('is_published', true)

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  return posts || []
}

// ============================================
// GENERAR RUTAS ESTÁTICAS - Clave para SSG
// ============================================
export async function generateStaticParams() {
  console.log('🔧 [BUILD] Generando rutas estáticas para publicaciones...')
  
  const posts = await getAllPosts()
  
  const params: { locale: string; slug: string }[] = []
  
  for (const post of posts) {
    params.push({ locale: 'es', slug: post.slug })
    params.push({ locale: 'en', slug: post.slug })
  }
  
  console.log(`✅ [BUILD] Generadas ${params.length} rutas estáticas (${posts.length} artículos x 2 idiomas)`)
  
  return params
}

// Obtener un post específico
async function getPost(slug: string, locale: string) {
  const posts = await getAllPosts()
  const post = posts.find((p: any) => p.slug === slug) as any
  
  if (!post) return null

  const isSpanish = locale === 'es'
  
  // Supabase devuelve category como objeto, no array
  const cat = post.category as any
  
  return {
    ...post,
    title: isSpanish ? post.title : (post.title_en || post.title),
    excerpt: isSpanish ? post.excerpt : (post.excerpt_en || post.excerpt),
    content: isSpanish ? post.content : (post.content_en || post.content),
    meta_title: isSpanish ? post.meta_title : (post.meta_title_en || post.meta_title),
    meta_description: isSpanish ? post.meta_description : (post.meta_description_en || post.meta_description),
    category: cat ? {
      id: cat.id,
      slug: cat.slug,
      name: isSpanish ? cat.name : (cat.name_en || cat.name)
    } : null
  }
}

// Obtener posts relacionados
async function getRelatedPosts(categoryId: string, currentId: string, locale: string) {
  const posts = await getAllPosts()
  
  const related = posts
    .filter((p: any) => p.category_id === categoryId && p.id !== currentId)
    .slice(0, 3)

  const isSpanish = locale === 'es'
  return related.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    title: isSpanish ? post.title : (post.title_en || post.title),
    featured_image: post.featured_image,
  }))
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPost(slug, locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const isSpanish = locale === 'es'
  const pageUrl = `${siteConfig.url}/${locale}/publicaciones/${slug}`

  if (!post) return { title: t('metaTitle') }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: pageUrl,
      languages: {
        'es-ES': `${siteConfig.url}/es/publicaciones/${slug}`,
        'en-US': `${siteConfig.url}/en/publicaciones/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: post.title,
      description: post.excerpt,
      siteName: siteConfig.name,
      locale: isSpanish ? 'es_ES' : 'en_US',
      images: post.featured_image ? [{
        url: post.featured_image,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [{
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      }],
      publishedTime: post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [`${siteConfig.url}/images/og-image.jpg`],
    },
  }
}

// Componente de la página
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const post = await getPost(slug, locale)
  const t = await getTranslations({ locale, namespace: 'blog' })

  if (!post) notFound()

  const relatedPosts = post.category?.id 
    ? await getRelatedPosts(post.category.id, post.id, locale) 
    : []

  const shareUrl = `${siteConfig.url}/${locale}/publicaciones/${post.slug}`

  return (
    <>
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: t('title'), href: '/publicaciones' },
              { label: post.title },
            ]}
            className="mb-6 text-gray-400"
          />

          {post.category && (
            <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-sm font-semibold rounded mb-4">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.photo_url && (
                  <Image src={post.author.photo_url} alt={post.author.name} width={32} height={32} className="rounded-full" />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString(
                locale === 'es' ? 'es-ES' : 'en-US',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.reading_time} {t('minRead')}
              </div>
            )}
          </div>
        </div>
      </section>

      {post.featured_image && (
        <section className="bg-cream">
          <div className="container-custom py-8">
            <div className="relative aspect-video max-h-[500px] overflow-hidden rounded-sm">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2">
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              <div className="mt-12 pt-8 border-t">
                <p className="text-sm font-medium text-gray-700 mb-4">{t('shareArticle')}</p>
                <div className="flex gap-3">
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0077B5] text-white rounded-full">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1DA1F2] text-white rounded-full">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1877F2] text-white rounded-full">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <LocalizedLink href="/publicaciones" className="inline-flex items-center gap-2 text-gold hover:underline">
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToBlog')}
                </LocalizedLink>
              </div>
            </article>

            <aside className="space-y-8">
              {post.author && (
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="font-serif font-semibold text-charcoal mb-4">{t('aboutAuthor')}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {post.author.photo_url && (
                      <Image src={post.author.photo_url} alt={post.author.name} width={64} height={64} className="rounded-full" />
                    )}
                    <div>
                      <p className="font-semibold text-charcoal">{post.author.name}</p>
                      {post.author.position && <p className="text-sm text-gray-500">{post.author.position}</p>}
                    </div>
                  </div>
                  {post.author.bio && <p className="text-sm text-gray-600 line-clamp-4">{post.author.bio}</p>}
                </div>
              )}

              <div className="bg-charcoal p-6 rounded-sm text-center">
                <h3 className="font-serif font-semibold text-white mb-3">{t('needHelp')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('needHelpText')}</p>
                <LocalizedLink href="/contacto" className="btn-primary w-full">{t('contact')}</LocalizedLink>
              </div>

              {relatedPosts.length > 0 && (
                <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="font-serif font-semibold text-charcoal mb-4">{t('relatedPosts')}</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relPost: any) => (
                      <LocalizedLink key={relPost.id} href={`/publicaciones/${relPost.slug}`} className="flex gap-3 group">
                        {relPost.featured_image && (
                          <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                            <Image src={relPost.featured_image} alt={relPost.title} fill className="object-cover" />
                          </div>
                        )}
                        <p className="text-sm text-gray-700 group-hover:text-gold transition-colors line-clamp-2">{relPost.title}</p>
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <CtaDark variant="light" />
    </>
  )
}
