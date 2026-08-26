import type { Metadata } from 'next'
import { Award, Euro, Calendar, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaFinal } from '@/components/home'
import { createClient } from '@supabase/supabase-js'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'

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
  const t = await getTranslations({ locale, namespace: 'cases' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/casos-exito`,
      languages: {
        'es-ES': `${siteConfig.url}/es/casos-exito`,
        'en-US': `${siteConfig.url}/en/casos-exito`,
      },
    },
  }
}

async function getCases() {
  const supabase = getSupabase()
  if (!supabase) return []

  try {
    const { data: cases } = await supabase
      .from('success_cases')
      .select(`
        *,
        service:services(title, slug)
      `)
      .eq('is_published', true)
      .order('result_amount', { ascending: false })

    return cases || []
  } catch {
    return []
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function CasosExitoPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cases = await getCases()
  const t = await getTranslations({ locale, namespace: 'cases' })
  const isSpanish = locale === 'es'

  // Calcular estadísticas
  const totalRecovered = cases.reduce((sum: number, c: any) => sum + (c.result_amount || 0), 0)
  const avgPerCase = cases.length > 0 ? totalRecovered / cases.length : 0

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
          <p className="text-lg text-gray-300 max-w-3xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-gold py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{cases.length}</div>
              <div className="text-white/80 text-sm uppercase tracking-wider">{t('casesPublished')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{formatCurrency(totalRecovered)}</div>
              <div className="text-white/80 text-sm uppercase tracking-wider">{t('totalRecovered')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{formatCurrency(avgPerCase)}</div>
              <div className="text-white/80 text-sm uppercase tracking-wider">{t('averagePerCase')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          {cases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((caseItem: any) => (
                <article
                  key={caseItem.id}
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gold mb-4">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        {caseItem.service?.title || (isSpanish ? 'Negligencia Médica' : 'Medical Negligence')}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      {isSpanish ? caseItem.title : (caseItem.title_en || caseItem.title)}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {isSpanish ? caseItem.description : (caseItem.description_en || caseItem.description)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-charcoal">
                        <Euro className="w-5 h-5 text-gold" />
                        <span className="text-xl font-bold">
                          {formatCurrency(caseItem.result_amount)}
                        </span>
                      </div>
                      {caseItem.year && (
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {caseItem.year}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t('comingSoon')}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-gray-100 rounded-sm">
            <p className="text-sm text-gray-600">
              <strong className="text-charcoal">{t('note')}:</strong> {t('disclaimer')}
            </p>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
