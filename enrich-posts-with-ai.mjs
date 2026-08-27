import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import OpenAI from 'openai'

// Cargar variables de entorno
config({ path: '.env.local' })

// Configuración
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  process.exit(1)
}

if (!openaiApiKey) {
  console.error('❌ Error: API Key de OpenAI no configurada')
  console.log('Por favor, añade OPENAI_API_KEY a tu archivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAI({ apiKey: openaiApiKey })

// Categorías disponibles para negligencias médicas
const CATEGORIES = [
  { slug: 'guias', name: 'Guías', name_en: 'Guides', description: 'Guías prácticas sobre negligencias médicas' },
  { slug: 'legal', name: 'Legal', name_en: 'Legal', description: 'Aspectos legales y jurídicos' },
  { slug: 'conceptos', name: 'Conceptos', name_en: 'Concepts', description: 'Conceptos básicos de negligencias médicas' },
  { slug: 'indemnizaciones', name: 'Indemnizaciones', name_en: 'Compensation', description: 'Información sobre indemnizaciones' },
  { slug: 'actualidad', name: 'Actualidad', name_en: 'News', description: 'Noticias y actualidad del sector' },
]

// Función para crear/obtener categorías
async function ensureCategories() {
  console.log('📂 Verificando categorías...\n')
  
  for (const category of CATEGORIES) {
    const { data: existing } = await supabase
      .from('post_categories')
      .select('id')
      .eq('slug', category.slug)
      .single()
    
    if (!existing) {
      const { error } = await supabase
        .from('post_categories')
        .insert({
          slug: category.slug,
          name: category.name,
          name_en: category.name_en,
          description: category.description,
          description_en: category.description,
        })
      
      if (error) {
        console.error(`   ❌ Error creando categoría ${category.name}:`, error.message)
      } else {
        console.log(`   ✅ Categoría creada: ${category.name}`)
      }
    } else {
      console.log(`   ✓ Categoría existente: ${category.name}`)
    }
  }
  
  console.log()
}

// Función para enriquecer un post con IA
async function enrichPostWithAI(post) {
  const prompt = `Eres un experto en SEO y traducción para un bufete de abogados especializado en negligencias médicas en España.

TÍTULO DEL POST: ${post.title}

CONTENIDO DEL POST:
${post.content}

CATEGORÍAS DISPONIBLES:
${CATEGORIES.map(c => `- ${c.slug}: ${c.name} (${c.description})`).join('\n')}

Tu tarea es:
1. Asignar la categoría más apropiada (devolver solo el slug)
2. Crear un meta título optimizado para SEO (máx. 60 caracteres)
3. Crear una meta descripción optimizada para SEO (máx. 155 caracteres)
4. Traducir TODO al inglés: título, excerpt, contenido completo, meta título y meta descripción

IMPORTANTE: 
- El contenido está en HTML, mantén todas las etiquetas HTML en la traducción
- El meta título debe ser atractivo y contener palabras clave
- La meta descripción debe incitar al clic
- Mantén el tono profesional y empático

Responde SOLO con un objeto JSON válido (sin markdown, sin explicaciones):
{
  "category_slug": "slug-de-categoria",
  "meta_title": "Meta título en español",
  "meta_description": "Meta descripción en español",
  "title_en": "Title in English",
  "excerpt_en": "Excerpt in English",
  "content_en": "<p>Full content in English with HTML tags</p>",
  "meta_title_en": "Meta title in English",
  "meta_description_en": "Meta description in English"
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5.6-terra',
      messages: [{
        role: 'system',
        content: 'Eres un experto en SEO y traducción especializado en contenido legal médico. Respondes SOLO con JSON válido, sin markdown ni explicaciones.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_completion_tokens: 8000,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content.trim()
    const enrichedData = JSON.parse(responseText)
    
    return enrichedData
  } catch (error) {
    console.error('Error procesando con IA:', error.message)
    return null
  }
}

// Función principal
async function enrichAllPosts() {
  console.log('🤖 Iniciando enriquecimiento de posts con IA...\n')
  
  // Asegurar que existan las categorías
  await ensureCategories()
  
  // Obtener todos los posts publicados sin categoría
  const { data: posts, error: fetchError } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, content, category_id, title_en')
    .eq('is_published', true)
    .order('published_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    return
  }
  
  if (!posts || posts.length === 0) {
    console.log('ℹ️  No hay posts para procesar')
    return
  }
  
  console.log(`📚 Total de posts a procesar: ${posts.length}\n`)
  
  let processed = 0
  let errors = 0
  
  // Obtener todas las categorías con sus IDs
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id, slug')
  
  const categoryMap = {}
  categories?.forEach(cat => {
    categoryMap[cat.slug] = cat.id
  })
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    console.log(`\n[${i + 1}/${posts.length}] Procesando: "${post.title}"`)
    console.log(`   Slug: ${post.slug}`)
    
    // Si ya tiene traducción, saltar
    if (post.title_en && post.category_id) {
      console.log('   ⏭️  Ya procesado (tiene traducción y categoría)')
      continue
    }
    
    // Enriquecer con IA
    console.log('   🤖 Consultando IA...')
    const enrichedData = await enrichPostWithAI(post)
    
    if (!enrichedData) {
      console.log('   ❌ Error en procesamiento con IA')
      errors++
      continue
    }
    
    // Obtener ID de categoría
    const categoryId = categoryMap[enrichedData.category_slug]
    
    if (!categoryId) {
      console.log(`   ⚠️  Categoría no encontrada: ${enrichedData.category_slug}`)
    }
    
    // Actualizar post en base de datos
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        category_id: categoryId,
        meta_title: enrichedData.meta_title,
        meta_description: enrichedData.meta_description,
        title_en: enrichedData.title_en,
        excerpt_en: enrichedData.excerpt_en,
        content_en: enrichedData.content_en,
        meta_title_en: enrichedData.meta_title_en,
        meta_description_en: enrichedData.meta_description_en,
      })
      .eq('id', post.id)
    
    if (updateError) {
      console.log(`   ❌ Error actualizando: ${updateError.message}`)
      errors++
    } else {
      console.log(`   ✅ Actualizado correctamente`)
      console.log(`   📁 Categoría: ${enrichedData.category_slug}`)
      console.log(`   🇪🇸 Meta: ${enrichedData.meta_title}`)
      console.log(`   🇬🇧 Meta EN: ${enrichedData.meta_title_en}`)
      processed++
    }
    
    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎉 Proceso completado!')
  console.log(`   ✅ Posts procesados: ${processed}`)
  console.log(`   ❌ Errores: ${errors}`)
  console.log(`   ⏭️  Saltados: ${posts.length - processed - errors}`)
  console.log('='.repeat(60))
}

// Ejecutar
enrichAllPosts().catch(console.error)

