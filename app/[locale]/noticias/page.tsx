import type { Metadata } from 'next'
import Image from 'next/image'
import { Calendar, ExternalLink, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaDark } from '@/components/home'
import { createClient } from '@supabase/supabase-js'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { siteConfig } from '@/config/site'
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

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/noticias`,
      languages: {
        'es-ES': `${siteConfig.url}/es/noticias`,
        'en-US': `${siteConfig.url}/en/noticias`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: `${siteConfig.url}/${locale}/noticias`,
      title: t('metaTitle'),
      description: t('metaDescription'),
      siteName: siteConfig.name,
    },
  }
}

async function getNews(locale: string) {
  const supabase = getSupabase()
  if (!supabase) return []

  try {
    const isSpanish = locale === 'es'
    
    const { data: news } = await supabase
      .from('news')
      .select(`
        id,
        slug,
        title,
        title_en,
        excerpt,
        excerpt_en,
        featured_image,
        published_at,
        source_name,
        source_url
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (!news) return []

    return news.map((item: any) => ({
      ...item,
      title: isSpanish ? item.title : (item.title_en || item.title),
      excerpt: isSpanish ? item.excerpt : (item.excerpt_en || item.excerpt),
    }))
  } catch {
    return []
  }
}

export default async function NoticiasPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const news = await getNews(locale)
  const t = await getTranslations({ locale, namespace: 'news' })

  return (
    <>
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: t('title') }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item: any) => (
                <article
                  key={item.id}
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {item.featured_image && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.published_at).toLocaleDateString(
                          locale === 'es' ? 'es-ES' : 'en-US',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </div>
                      {item.source_name && (
                        <span className="text-gold">{item.source_name}</span>
                      )}
                    </div>
                    <h2 className="text-lg font-serif font-semibold text-charcoal mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <LocalizedLink
                        href={`/noticias/${item.slug}`}
                        className="text-gold text-sm font-medium flex items-center gap-1 hover:underline"
                      >
                        {t('readMore')}
                        <ArrowRight className="w-4 h-4" />
                      </LocalizedLink>
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gold transition-colors"
                          title="Ver fuente"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">{t('noNews')}</p>
            </div>
          )}
        </div>
      </section>

      <CtaDark variant="light" />
    </>
  )
}
