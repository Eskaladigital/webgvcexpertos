import { siteConfig } from '@/config/site'

function postalAddressMurcia() {
  const o = siteConfig.office
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: o.streetAddress,
    addressLocality: o.addressLocality,
    postalCode: o.postalCode,
    addressRegion: o.addressRegion,
    addressCountry: o.addressCountry,
  }
}

function geoMurcia() {
  return {
    '@type': 'GeoCoordinates' as const,
    latitude: siteConfig.office.latitude,
    longitude: siteConfig.office.longitude,
  }
}

// ============================================
// ORGANIZATION - Para toda la web
// ============================================
export function JsonLdOrganization() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo.png`,
      width: 300,
      height: 60,
    },
    description: siteConfig.description,
    address: postalAddressMurcia(),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phone,
        contactType: 'customer service',
        availableLanguage: ['Spanish'],
        areaServed: 'ES',
      },
    ],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.facebook,
    ].filter(Boolean),
    foundingDate: String(siteConfig.foundedYear),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// LOCAL BUSINESS / LEGAL SERVICE
// ============================================
export function JsonLdLocalBusiness() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${siteConfig.url}/#legalbusiness`,
    name: siteConfig.name,
    image: [
      `${siteConfig.url}/images/og-image.jpg`,
      `${siteConfig.url}/images/logo.png`,
    ],
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    description: siteConfig.description,
    slogan: 'Despacho en Murcia. Negligencias médicas en todo el territorio.',
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    address: postalAddressMurcia(),
    geo: geoMurcia(),
    hasMap: siteConfig.office.hasMap,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
    knowsAbout: [
      'Negligencias médicas',
      'Errores de diagnóstico',
      'Errores quirúrgicos',
      'Mala praxis médica',
      'Derecho sanitario',
      'Indemnizaciones médicas',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// WEBSITE - Para SEO general
// ============================================
export function JsonLdWebsite() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// BREADCRUMBS
// ============================================
export function JsonLdBreadcrumbs({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// SERVICE - Para páginas de servicios
// ============================================
export function JsonLdService({
  name,
  description,
  url,
  image,
}: {
  name: string
  description: string
  url: string
  image?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    image: image || `${siteConfig.url}/images/og-image.jpg`,
    provider: {
      '@type': 'LegalService',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
    serviceType: 'Legal Service',
    category: 'Negligencias Médicas',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de reclamación por negligencia médica',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Consulta inicial',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Estudio de viabilidad del caso',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Reclamación judicial',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// FAQ - Para preguntas frecuentes
// ============================================
export function JsonLdFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// ARTICLE - Para blog posts
// ============================================
export function JsonLdArticle({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string
  description: string
  url?: string
  image?: string
  datePublished: string
  dateModified?: string
  author: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: url || siteConfig.url,
    image: image || `${siteConfig.url}/images/og-image.jpg`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: `${siteConfig.url}/equipo`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url || siteConfig.url,
    },
    inLanguage: 'es-ES',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// NEWS ARTICLE - Para noticias
// ============================================
export function JsonLdNewsArticle({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url,
    image: image || `${siteConfig.url}/images/og-image.jpg`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'es-ES',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// LOCAL BUSINESS para ciudades específicas
// ============================================
export function JsonLdLocalBusinessCity({
  cityName,
  citySlug,
  province,
  locale = 'es',
}: {
  cityName: string
  citySlug: string
  province: string
  locale?: string
}) {
  const pageUrl = `${siteConfig.url}/${locale}/${citySlug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${pageUrl}/#legalservice`,
    name: siteConfig.name,
    image: `${siteConfig.url}/images/og-image.jpg`,
    url: pageUrl,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    description: `Negligencias médicas ocurridas en ${cityName}, ${province}. Despacho en Murcia. Servicio en todo el territorio español.`,
    address: postalAddressMurcia(),
    geo: geoMurcia(),
    hasMap: siteConfig.office.hasMap,
    parentOrganization: {
      '@id': `${siteConfig.url}/#organization`,
    },
    areaServed: [
      {
        '@type': 'City',
        name: cityName,
      },
      {
        '@type': 'Country',
        name: 'España',
      },
    ],
    priceRange: '€€€',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// PERSON - Para páginas de equipo
// ============================================
export function JsonLdPerson({
  name,
  jobTitle,
  image,
  description,
  sameAs,
}: {
  name: string
  jobTitle: string
  image?: string
  description?: string
  sameAs?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    image: image || `${siteConfig.url}/images/team/default.jpg`,
    description,
    worksFor: {
      '@type': 'LegalService',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    sameAs: sameAs || [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// CONTACT PAGE
// ============================================
export function JsonLdContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto - GVC Expertos',
    description: 'Contacta con nuestros abogados especializados en negligencias médicas. Te escuchamos y analizamos tu caso.',
    url: `${siteConfig.url}/contacto`,
    mainEntity: {
      '@type': 'LegalService',
      name: siteConfig.name,
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// ABOUT PAGE
// ============================================
export function JsonLdAboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre Nosotros - GVC Expertos',
    description: 'Conoce a GVC Expertos, despacho de abogados especializado en negligencias médicas con más de 20 años de experiencia.',
    url: `${siteConfig.url}/sobre-nosotros`,
    mainEntity: {
      '@id': `${siteConfig.url}/#organization`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// PROFESSIONAL SERVICE (alternativa a LegalService)
// ============================================
export function JsonLdProfessionalService() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: `${siteConfig.url}/images/og-image.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddressMurcia(),
    geo: geoMurcia(),
    areaServed: 'ES',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios Legales',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Negligencias Médicas',
          itemListElement: siteConfig.services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              url: `${siteConfig.url}/negligencias-medicas/${service.slug}`,
            },
          })),
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
