import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaDark } from '@/components/home'
import { siteConfig } from '@/config/site'
import { createClient } from '@supabase/supabase-js'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { getTranslations } from 'next-intl/server'

// ============================================
// PÁGINA ESTÁTICA - Se genera durante el build
// ============================================

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Obtener todas las noticias para generar rutas estáticas
async function getAllNews() {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)

  if (error) return []
  return news || []
}

// Generar rutas estáticas
export async function generateStaticParams() {
  console.log('🔧 [BUILD] Generando rutas estáticas para noticias...')
  
  const news = await getAllNews()
  
  const params: { locale: string; slug: string }[] = []
  
  for (const item of news) {
    params.push({ locale: 'es', slug: item.slug })
    params.push({ locale: 'en', slug: item.slug })
  }
  
  console.log(`✅ [BUILD] Generadas ${params.length} rutas de noticias`)
  
  return params
}

async function getNewsItem(slug: string, locale: string) {
  const news = await getAllNews()
  const item = news.find(n => n.slug === slug)
  
  if (!item) return null

  const isSpanish = locale === 'es'
  return {
    ...item,
    title: isSpanish ? item.title : (item.title_en || item.title),
    excerpt: isSpanish ? item.excerpt : (item.excerpt_en || item.excerpt),
    content: isSpanish ? item.content : (item.content_en || item.content),
    meta_title: isSpanish ? item.meta_title : (item.meta_title_en || item.meta_title),
    meta_description: isSpanish ? item.meta_description : (item.meta_description_en || item.meta_description),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const item = await getNewsItem(slug, locale)
  const t = await getTranslations({ locale, namespace: 'news' })

  if (!item) return { title: t('title') }

  return {
    title: item.meta_title || item.title,
    description: item.meta_description || item.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/noticias/${item.slug}`,
    },
    openGraph: {
      type: 'article',
      title: item.title,
      description: item.excerpt,
      images: item.featured_image ? [{ url: item.featured_image }] : undefined,
    },
  }
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const item = await getNewsItem(slug, locale)
  const t = await getTranslations({ locale, namespace: 'news' })

  if (!item) notFound()

  return (
    <>
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: t('title'), href: '/noticias' },
              { label: item.title },
            ]}
            className="mb-6 text-gray-400"
          />

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 max-w-4xl">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(item.published_at).toLocaleDateString(
                locale === 'es' ? 'es-ES' : 'en-US',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </div>
            {item.source_name && (
              <span className="text-gold">{item.source_name}</span>
            )}
          </div>
        </div>
      </section>

      {item.featured_image && (
        <section className="bg-cream">
          <div className="container-custom py-8">
            <div className="relative aspect-video max-h-[500px] overflow-hidden rounded-sm">
              <Image
                src={item.featured_image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            <div className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4">
              <LocalizedLink
                href="/noticias"
                className="inline-flex items-center gap-2 text-gold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToNews')}
              </LocalizedLink>

              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors"
                >
                  {t('viewOriginalSource')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaDark variant="light" />
    </>
  )
}
