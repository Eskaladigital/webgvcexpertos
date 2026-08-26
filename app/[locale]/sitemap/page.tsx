import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { siteConfig, services, cities } from '@/config/site'
import { routes, getTranslatedRoute, getTranslatedServiceRoute } from '@/lib/routes'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { getTranslations } from 'next-intl/server'

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sitemap' })
  const isSpanish = locale === 'es'
  
  return {
    title: isSpanish ? 'Mapa del Sitio' : 'Sitemap',
    description: isSpanish
      ? 'Mapa del sitio web de GVC Expertos. Todas las páginas y secciones disponibles.'
      : 'GVC Expertos website sitemap. All available pages and sections.',
    alternates: {
      canonical: `/${locale}/sitemap`,
    },
  }
}

export default async function SitemapPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sitemap' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tServices = await getTranslations({ locale, namespace: 'services' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })
  const isSpanish = locale === 'es'
  const localeRoutes = routes[locale as 'es' | 'en']

  // Obtener posts y noticias publicados
  let posts: Array<{ slug: string; title: string; category_slug: string }> = []
  let news: Array<{ slug: string; title: string }> = []

  try {
    const supabase = getSupabaseAdmin()
    
    // Obtener posts con su categoría para construir la URL correcta
    const { data: postsData } = await supabase
      .from('posts')
      .select(`
        slug, 
        title,
        category:post_categories(slug)
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(100)

    if (postsData) {
      posts = postsData.map((post: any) => ({
        slug: post.slug,
        title: post.title,
        category_slug: post.category?.slug || 'articulos'
      }))
    }

    const { data: newsData } = await supabase
      .from('news')
      .select('slug, title')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(100)

    if (newsData) {
      news = newsData
    }
  } catch (error) {
    console.warn('No se pudieron obtener posts/noticias para el sitemap HTML:', error)
  }

  const serviceSlugMap: Record<string, string> = {
    'errores-quirurgicos': 'surgical-errors',
    'errores-diagnostico': 'diagnostic-errors',
    'negligencia-hospitalaria': 'hospital-negligence',
    'negligencia-obstetrica': 'obstetric-negligence',
    'errores-medicacion': 'medication-errors',
    'consentimiento-informado': 'informed-consent',
  }

  return (
    <>
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Mapa del Sitio' : 'Sitemap' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            {isSpanish ? (
              <>
                Mapa del <span className="text-gold">Sitio</span>
              </>
            ) : (
              <>
                <span className="text-gold">Sitemap</span>
              </>
            )}
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            {isSpanish
              ? 'Todas las páginas y secciones disponibles en nuestro sitio web'
              : 'All available pages and sections on our website'}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Páginas Principales */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                {t('mainPages')}
              </h2>
              <ul className="space-y-2">
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('home', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('home')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('about', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('about')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('team', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('team')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('services', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('services')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('blog', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('blog')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('contact', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('contact')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={getTranslatedRoute('faq', locale as 'es' | 'en')}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('faq')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={`/${locale}/casos-exito`}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tNav('cases')}
                  </LocalizedLink>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                {t('services')}
              </h2>
              <ul className="space-y-2">
                {services.map((service) => {
                  // Las claves de traducción siempre están en inglés
                  const translationKey = serviceSlugMap[service.slug] || service.slug
                  const servicePath = getTranslatedServiceRoute(service.slug, locale as 'es' | 'en')
                  return (
                    <li key={service.slug}>
                      <LocalizedLink
                        href={servicePath}
                        className="text-gold hover:text-gold-dark transition-colors"
                      >
                        {tServices(`${translationKey}.title`)}
                      </LocalizedLink>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Ciudades */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                {t('cities')} ({cities.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {[...cities].sort((a, b) => a.name.localeCompare(b.name, 'es')).map((city) => (
                  <LocalizedLink
                    key={city.slug}
                    href={`/${locale}/${city.slug}`}
                    className="text-gray-700 hover:text-gold transition-colors text-sm"
                  >
                    {city.name}
                  </LocalizedLink>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            {posts.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                  {t('blogPosts')} ({posts.length})
                </h2>
                <ul className="space-y-2">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <LocalizedLink
                        href={`/publicaciones/${post.slug}`}
                        className="text-gray-700 hover:text-gold transition-colors"
                      >
                        {post.title}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Noticias */}
            {news.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                  {t('news')} ({news.length})
                </h2>
                <ul className="space-y-2">
                  {news.map((item) => (
                    <li key={item.slug}>
                      <LocalizedLink
                        href={`/${locale}/noticias/${item.slug}`}
                        className="text-gray-700 hover:text-gold transition-colors"
                      >
                        {item.title}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Páginas Legales */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                {t('legalPages')}
              </h2>
              <ul className="space-y-2">
                <li>
                  <LocalizedLink
                    href={localeRoutes.legal.notice}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tFooter('legalNotice')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={localeRoutes.legal.privacy}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tFooter('privacy')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={localeRoutes.legal.cookies}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {tFooter('cookies')}
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href={`/${locale}/sitemap`}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {t('sitemap')}
                  </LocalizedLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

