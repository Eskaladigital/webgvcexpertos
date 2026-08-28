/**
 * Configuración global del sitio GVC Expertos
 */

/**
 * Servicios/Tipos de negligencias médicas
 */
export const services = [
  {
    slug: 'errores-quirurgicos',
    title: 'Errores Quirúrgicos',
    shortDescription:
      'Negligencias durante intervenciones: instrumentos olvidados, cirugía en zona incorrecta, lesiones nerviosas.',
    icon: 'scalpel',
  },
  {
    slug: 'errores-diagnostico',
    title: 'Errores de Diagnóstico',
    shortDescription:
      'Diagnósticos tardíos, incorrectos o perdidos que causan retraso en el tratamiento.',
    icon: 'stethoscope',
  },
  {
    slug: 'negligencia-hospitalaria',
    title: 'Negligencia Hospitalaria',
    shortDescription:
      'Infecciones nosocomiales, caídas, úlceras por presión, fallos en protocolos.',
    icon: 'hospital',
  },
  {
    slug: 'negligencia-obstetrica',
    title: 'Negligencia Obstétrica',
    shortDescription:
      'Lesiones durante el parto: parálisis cerebral, lesiones del plexo braquial, hipoxia.',
    icon: 'baby',
  },
  {
    slug: 'errores-medicacion',
    title: 'Errores de Medicación',
    shortDescription:
      'Dosis incorrectas, medicamentos contraindicados, reacciones adversas evitables.',
    icon: 'pill',
  },
  {
    slug: 'consentimiento-informado',
    title: 'Consentimiento Informado',
    shortDescription:
      'Falta de información sobre riesgos, procedimientos no autorizados.',
    icon: 'clipboard',
  },
]

/**
 * Landings de territorio (107 ciudades).
 * La URL nombra dónde ocurrió el daño; el despacho está en Murcia y presta
 * el servicio en todo el territorio. No son sucursales.
 * Slug: abogados-negligencias-medicas-{ciudad}
 */
export const cities: {
  slug: string
  name: string
  province: string
  community: string
}[] = [
  // A Coruña / Galicia
  { slug: 'abogados-negligencias-medicas-a-coruna', name: 'A Coruña', province: 'A Coruña', community: 'Galicia' },
  { slug: 'abogados-negligencias-medicas-ferrol', name: 'Ferrol', province: 'A Coruña', community: 'Galicia' },
  { slug: 'abogados-negligencias-medicas-santiago-de-compostela', name: 'Santiago de Compostela', province: 'A Coruña', community: 'Galicia' },
  
  // Albacete / Castilla-La Mancha
  { slug: 'abogados-negligencias-medicas-albacete', name: 'Albacete', province: 'Albacete', community: 'Castilla-La Mancha' },
  { slug: 'abogados-negligencias-medicas-hellin', name: 'Hellín', province: 'Albacete', community: 'Castilla-La Mancha' },
  
  // Alicante / Comunidad Valenciana
  { slug: 'abogados-negligencias-medicas-alicante', name: 'Alicante', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-alcoy', name: 'Alcoy', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-almoradi', name: 'Almoradí', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-benidorm', name: 'Benidorm', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-callosa-del-segura', name: 'Callosa del Segura', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-denia', name: 'Denia', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-elda', name: 'Elda', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-javea', name: 'Jávea', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-orihuela', name: 'Orihuela', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-pilar-de-la-horadada', name: 'Pilar de la Horadada', province: 'Alicante', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-torrevieja', name: 'Torrevieja', province: 'Alicante', community: 'Comunidad Valenciana' },
  
  // Almería / Andalucía
  { slug: 'abogados-negligencias-medicas-el-ejido', name: 'El Ejido', province: 'Almería', community: 'Andalucía' },
  
  // Asturias
  { slug: 'abogados-negligencias-medicas-aviles', name: 'Avilés', province: 'Asturias', community: 'Asturias' },
  { slug: 'abogados-negligencias-medicas-gijon', name: 'Gijón', province: 'Asturias', community: 'Asturias' },
  { slug: 'abogados-negligencias-medicas-siero', name: 'Siero', province: 'Asturias', community: 'Asturias' },
  
  // Badajoz / Extremadura
  { slug: 'abogados-negligencias-medicas-badajoz', name: 'Badajoz', province: 'Badajoz', community: 'Extremadura' },
  { slug: 'abogados-negligencias-medicas-merida', name: 'Mérida', province: 'Badajoz', community: 'Extremadura' },
  
  // Baleares
  { slug: 'abogados-negligencias-medicas-ibiza', name: 'Ibiza', province: 'Islas Baleares', community: 'Islas Baleares' },
  { slug: 'abogados-negligencias-medicas-palma-de-mallorca', name: 'Palma de Mallorca', province: 'Islas Baleares', community: 'Islas Baleares' },
  
  // Barcelona / Cataluña
  { slug: 'abogados-negligencias-medicas-barcelona', name: 'Barcelona', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-granollers', name: 'Granollers', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-manresa', name: 'Manresa', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-mataro', name: 'Mataró', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-mollet-del-valles', name: 'Mollet del Vallès', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-rubi', name: 'Rubí', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-sabadell', name: 'Sabadell', province: 'Barcelona', community: 'Cataluña' },
  { slug: 'abogados-negligencias-medicas-villanueva-y-la-geltru', name: 'Villanueva y La Geltrú', province: 'Barcelona', community: 'Cataluña' },
  
  // Burgos / Castilla y León
  { slug: 'abogados-negligencias-medicas-burgos', name: 'Burgos', province: 'Burgos', community: 'Castilla y León' },
  
  // Cáceres / Extremadura
  { slug: 'abogados-negligencias-medicas-caceres', name: 'Cáceres', province: 'Cáceres', community: 'Extremadura' },
  
  // Cádiz / Andalucía
  { slug: 'abogados-negligencias-medicas-cadiz', name: 'Cádiz', province: 'Cádiz', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-algeciras', name: 'Algeciras', province: 'Cádiz', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-chiclana', name: 'Chiclana', province: 'Cádiz', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-jerez-de-la-frontera', name: 'Jerez de la Frontera', province: 'Cádiz', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-puerto-de-santa-maria', name: 'Puerto de Santa María', province: 'Cádiz', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-san-fernando', name: 'San Fernando', province: 'Cádiz', community: 'Andalucía' },
  
  // Cantabria
  { slug: 'abogados-negligencias-medicas-santander', name: 'Santander', province: 'Cantabria', community: 'Cantabria' },
  { slug: 'abogados-negligencias-medicas-torrelavega', name: 'Torrelavega', province: 'Cantabria', community: 'Cantabria' },
  
  // Castellón / Comunidad Valenciana
  { slug: 'abogados-negligencias-medicas-castellon', name: 'Castellón', province: 'Castellón', community: 'Comunidad Valenciana' },
  
  // Ciudad Real / Castilla-La Mancha
  { slug: 'abogados-negligencias-medicas-ciudad-real', name: 'Ciudad Real', province: 'Ciudad Real', community: 'Castilla-La Mancha' },
  
  // Córdoba / Andalucía
  { slug: 'abogados-negligencias-medicas-cordoba', name: 'Córdoba', province: 'Córdoba', community: 'Andalucía' },
  
  // Granada / Andalucía
  { slug: 'abogados-negligencias-medicas-granada', name: 'Granada', province: 'Granada', community: 'Andalucía' },
  
  // Guadalajara / Castilla-La Mancha
  { slug: 'abogados-negligencias-medicas-guadalajara', name: 'Guadalajara', province: 'Guadalajara', community: 'Castilla-La Mancha' },
  
  // Guipúzcoa / País Vasco
  { slug: 'abogados-negligencias-medicas-donostia-san-sebastian', name: 'Donostia San Sebastián', province: 'Guipúzcoa', community: 'País Vasco' },
  { slug: 'abogados-negligencias-medicas-irun', name: 'Irún', province: 'Guipúzcoa', community: 'País Vasco' },
  
  // Jaén / Andalucía
  { slug: 'abogados-negligencias-medicas-jaen', name: 'Jaén', province: 'Jaén', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-linares', name: 'Linares', province: 'Jaén', community: 'Andalucía' },
  
  // La Rioja
  { slug: 'abogados-negligencias-medicas-logrono', name: 'Logroño', province: 'La Rioja', community: 'La Rioja' },
  
  // Las Palmas / Canarias
  { slug: 'abogados-negligencias-medicas-las-palmas-de-gran-canaria', name: 'Las Palmas de Gran Canaria', province: 'Las Palmas', community: 'Canarias' },
  { slug: 'abogados-negligencias-medicas-arrecife', name: 'Arrecife', province: 'Las Palmas', community: 'Canarias' },
  { slug: 'abogados-negligencias-medicas-telde', name: 'Telde', province: 'Las Palmas', community: 'Canarias' },
  
  // León / Castilla y León
  { slug: 'abogados-negligencias-medicas-ponferrada', name: 'Ponferrada', province: 'León', community: 'Castilla y León' },
  
  // Lleida / Cataluña
  { slug: 'abogados-negligencias-medicas-lleida-lerida', name: 'Lleida - Lérida', province: 'Lleida', community: 'Cataluña' },
  
  // Madrid / Comunidad de Madrid
  { slug: 'abogados-negligencias-medicas-madrid', name: 'Madrid', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-alcorcon', name: 'Alcorcón', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-aranjuez', name: 'Aranjuez', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-arganda-del-rey', name: 'Arganda del Rey', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-fuenlabrada', name: 'Fuenlabrada', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-las-rozas', name: 'Las Rozas', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-leganes', name: 'Leganés', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-mostoles', name: 'Móstoles', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-parla', name: 'Parla', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-pozuelo-de-alarcon', name: 'Pozuelo de Alarcón', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-san-sebastian-de-los-reyes', name: 'San Sebastián de los Reyes', province: 'Madrid', community: 'Comunidad de Madrid' },
  { slug: 'abogados-negligencias-medicas-valdemoro', name: 'Valdemoro', province: 'Madrid', community: 'Comunidad de Madrid' },
  
  // Málaga / Andalucía
  { slug: 'abogados-negligencias-medicas-malaga', name: 'Málaga', province: 'Málaga', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-fuengirola', name: 'Fuengirola', province: 'Málaga', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-marbella', name: 'Marbella', province: 'Málaga', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-torremolinos', name: 'Torremolinos', province: 'Málaga', community: 'Andalucía' },
  
  // Murcia / Región de Murcia
  { slug: 'abogados-negligencias-medicas-murcia', name: 'Murcia', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-aguilas', name: 'Águilas', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-alcantarilla', name: 'Alcantarilla', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-alhama-de-murcia', name: 'Alhama de Murcia', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-cartagena', name: 'Cartagena', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-cehegin', name: 'Cehegín', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-cieza', name: 'Cieza', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-los-alcazares', name: 'Los Alcázares', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-molina-de-segura', name: 'Molina de Segura', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-san-javier', name: 'San Javier', province: 'Murcia', community: 'Región de Murcia' },
  { slug: 'abogados-negligencias-medicas-yecla', name: 'Yecla', province: 'Murcia', community: 'Región de Murcia' },
  
  // Navarra
  { slug: 'abogados-negligencias-medicas-pamplona', name: 'Pamplona', province: 'Navarra', community: 'Navarra' },
  
  // Ourense / Galicia
  { slug: 'abogados-negligencias-medicas-orense', name: 'Orense', province: 'Ourense', community: 'Galicia' },
  
  // Palencia / Castilla y León
  { slug: 'abogados-negligencias-medicas-palencia', name: 'Palencia', province: 'Palencia', community: 'Castilla y León' },
  
  // Pontevedra / Galicia
  { slug: 'abogados-negligencias-medicas-pontevedra', name: 'Pontevedra', province: 'Pontevedra', community: 'Galicia' },
  { slug: 'abogados-negligencias-medicas-vigo', name: 'Vigo', province: 'Pontevedra', community: 'Galicia' },
  
  // Salamanca / Castilla y León
  { slug: 'abogados-negligencias-medicas-salamanca', name: 'Salamanca', province: 'Salamanca', community: 'Castilla y León' },
  
  // Santa Cruz de Tenerife / Canarias
  { slug: 'abogados-negligencias-medicas-tenerife', name: 'Tenerife', province: 'Santa Cruz de Tenerife', community: 'Canarias' },
  { slug: 'abogados-negligencias-medicas-arona', name: 'Arona', province: 'Santa Cruz de Tenerife', community: 'Canarias' },
  
  // Segovia / Castilla y León
  { slug: 'abogados-negligencias-medicas-segovia', name: 'Segovia', province: 'Segovia', community: 'Castilla y León' },
  
  // Sevilla / Andalucía
  { slug: 'abogados-negligencias-medicas-sevilla', name: 'Sevilla', province: 'Sevilla', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-alcala-de-guadaira', name: 'Alcalá de Guadaira', province: 'Sevilla', community: 'Andalucía' },
  { slug: 'abogados-negligencias-medicas-utrera', name: 'Utrera', province: 'Sevilla', community: 'Andalucía' },
  
  // Tarragona / Cataluña
  { slug: 'abogados-negligencias-medicas-tarragona', name: 'Tarragona', province: 'Tarragona', community: 'Cataluña' },
  
  // Toledo / Castilla-La Mancha
  { slug: 'abogados-negligencias-medicas-toledo', name: 'Toledo', province: 'Toledo', community: 'Castilla-La Mancha' },
  { slug: 'abogados-negligencias-medicas-talavera-de-la-reina', name: 'Talavera de la Reina', province: 'Toledo', community: 'Castilla-La Mancha' },
  
  // Valencia / Comunidad Valenciana
  { slug: 'abogados-negligencias-medicas-valencia', name: 'Valencia', province: 'Valencia', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-gandia', name: 'Gandía', province: 'Valencia', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-paterna', name: 'Paterna', province: 'Valencia', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-sagunto', name: 'Sagunto', province: 'Valencia', community: 'Comunidad Valenciana' },
  { slug: 'abogados-negligencias-medicas-torrent', name: 'Torrent', province: 'Valencia', community: 'Comunidad Valenciana' },
  
  // Valladolid / Castilla y León
  { slug: 'abogados-negligencias-medicas-valladolid', name: 'Valladolid', province: 'Valladolid', community: 'Castilla y León' },
  
  // Álava / País Vasco
  { slug: 'abogados-negligencias-medicas-vitoria', name: 'Vitoria', province: 'Álava', community: 'País Vasco' },
  
  // Zaragoza / Aragón
  { slug: 'abogados-negligencias-medicas-zaragoza', name: 'Zaragoza', province: 'Zaragoza', community: 'Aragón' },
]

/**
 * Miembros del equipo
 */
export const teamMembers = [
  {
    slug: 'pedro-alfonso-garcia-valcarcel',
    name: 'Pedro Alfonso García Valcárcel',
    position: 'Abogado - Fundador',
    shortBio: 'Fundador del bufete. Licenciado en derecho por la Universidad de Murcia en el año 1968.',
    image: '/images/equipo/garcia_valcarcel_caceres_abogados_negligencias_medicas_pedro_alfonso_garcia_valcarcel_vf.png',
  },
  {
    slug: 'raquel-garcia-valcarcel',
    name: 'Raquel García Valcárcel',
    position: 'Abogada',
    shortBio: 'Licenciada en derecho por la Universidad Nacional Española a Distancia (UNED) en el año 1999.',
    image: '/images/equipo/garcia_valcarcel_caceres_abogados_negligencias_medicas_raquel_garcia_valcarcel_vf.png',
  },
  {
    slug: 'miguel-caceres-sanchez',
    name: 'Miguel Cáceres Sánchez',
    position: 'Abogado',
    shortBio: 'Licenciado en derecho por la Universidad de Almería en el año 2000.',
    image: '/images/equipo/garcia_valcarcel_caceres_abogados_negligencias_medicas_miguel_caceres_sanchez_vf.png',
  },
  {
    slug: 'olga-martinez-martinez',
    name: 'Olga Martínez Martínez',
    position: 'Abogada',
    shortBio: 'Licenciada en derecho por la Universidad de Murcia en el año 2001 y doctorando en Derecho civil.',
    image: '/images/equipo/garcia_valcarcel_caceres_abogados_negligencias_medicas_olga_martinez_martinez_vf.png',
  },
  {
    slug: 'carmen-martinez-ramon',
    name: 'Carmen Martínez Ramón',
    position: 'Secretaria de Dirección',
    shortBio: 'Instituto Politécnico F.P. de Albacete 1996.',
    image: '/images/equipo/garcia_valcarcel_caceres_abogados_negligencias_medicas_carmen_martinez_ramon_vf.png',
  },
]

/**
 * Configuración principal del sitio
 */
export const siteConfig = {
  name: 'GVC Expertos',
  legalName: 'GVC Expertos Abogados S.L.P.',
  description:
    'Bufete de abogados en Murcia con trayectoria desde 1946. Despacho multidisciplinar especializado en negligencias médicas y derecho sanitario.',
  url: 'https://www.gvcexpertos.com',
  ogImage: '/images/og-image.jpg',
  foundedYear: 1946,
  contact: {
    phone: '968 241 025',
    phoneHref: 'tel:+34968241025',
    email: 'contacto@gvcabogados.com',
    emailHref: 'mailto:contacto@gvcabogados.com',
    address: 'Plaza Fuensanta, 3 - 6ºB, 30008 Murcia',
    schedule: 'Lun - Vie: 9:00 - 19:00',
  },
  /** NAP único. Las landings de ciudad no inventan oficina local. */
  office: {
    streetAddress: 'Plaza Fuensanta, 3 - 6ºB',
    addressLocality: 'Murcia',
    postalCode: '30008',
    addressRegion: 'Región de Murcia',
    addressCountry: 'ES',
    latitude: 37.9922,
    longitude: -1.1307,
    hasMap: 'https://maps.google.com/?q=Plaza+Fuensanta+3+Murcia',
  },
  social: {
    linkedin: 'https://linkedin.com/company/gvcexpertos',
    twitter: 'https://twitter.com/gvc_abogados',
    facebook: 'https://www.facebook.com/garciavalcarcel/',
  },
  legal: {
    company: 'GVC Expertos Abogados S.L.P.',
    cif: 'B-12345678',
    registroMercantil: 'Registro Mercantil de Murcia',
  },
  services,
  cities,
  teamMembers,
}

/**
 * Navegación principal
 */
export const mainNavigation = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Negligencias Médicas',
    href: '/negligencias-medicas',
    children: services.map((s) => ({
      label: s.title,
      href: `/negligencias-medicas/${s.slug}`,
    })),
  },
  { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
  { label: 'Equipo', href: '/equipo' },
  { label: 'Publicaciones', href: '/publicaciones' },
  { label: 'Contacto', href: '/contacto' },
]

/**
 * Navegación del footer
 */
export const footerNavigation = {
  servicios: services.map((s) => ({
    label: s.title,
    href: `/negligencias-medicas/${s.slug}`,
  })),
  empresa: [
    { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { label: 'Equipo', href: '/equipo' },
    { label: 'Publicaciones', href: '/publicaciones' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
  ],
  legal: [
    { label: 'Aviso Legal', href: '/aviso-legal' },
    { label: 'Política de Privacidad', href: '/politica-privacidad' },
    { label: 'Política de Cookies', href: '/politica-cookies' },
  ],
}

/**
 * Alias para compatibilidad con componentes
 */
export const navigationLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/negligencias-medicas' },
  { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
  { label: 'Equipo', href: '/equipo' },
  { label: 'Publicaciones', href: '/publicaciones' },
  { label: 'Contacto', href: '/contacto' },
]

export const footerLinks = footerNavigation

/**
 * Pasos del proceso de reclamación
 */
export const processSteps = [
  {
    number: '01',
    title: 'Consulta Gratuita',
    description: 'Analizamos tu caso sin compromiso. Te explicamos tus derechos y posibilidades de éxito.',
  },
  {
    number: '02',
    title: 'Recopilación de Pruebas',
    description: 'Solicitamos historiales médicos, informes periciales y toda la documentación necesaria.',
  },
  {
    number: '03',
    title: 'Reclamación Extrajudicial',
    description: 'Intentamos un acuerdo con el centro médico o aseguradora antes de ir a juicio.',
  },
  {
    number: '04',
    title: 'Demanda Judicial',
    description: 'Si no hay acuerdo, presentamos demanda y defendemos tu caso ante los tribunales.',
  },
  {
    number: '05',
    title: 'Indemnización',
    description: 'Luchamos por conseguir la máxima indemnización que te corresponde por los daños sufridos.',
  },
  {
    number: '06',
    title: 'Seguimiento',
    description: 'Te acompañamos durante todo el proceso y te mantenemos informado en cada fase.',
  },
]
