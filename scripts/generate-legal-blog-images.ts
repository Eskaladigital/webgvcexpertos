/**
 * Portada + 2 figuras (gpt-image-2 1536x1024). Sube a Storage público
 * para que gvcexpertos.com las vea sin deploy.
 *
 *   npx tsx scripts/generate-legal-blog-images.ts --post-id=UUID
 */
import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import OpenAI from "openai";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const POST_ID = process.argv.find((a) => a.startsWith("--post-id="))?.slice("--post-id=".length);

const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
const SIZE = "1536x1024" as const;

const LEGAL_TAIL =
  "Fotografía editorial hiperrealista, luz natural suave, tono serio y profesional. Sin texto, logos, marcas, watermarks ni letras legibles. Sin caras reconocibles, sin pacientes identificables, sin sangre, sin heridas, sin quirófano cruento. No estilo ilustración ni IA evidente.";

function promptsForTitle(title: string): [string, string, string] {
  const t = title.toLowerCase();
  let cover =
    "Portada horizontal: mesa de despacho jurídico-sanitario en Murcia, carpeta clínica cerrada, bolígrafo, luz de tarde, fondo de consulta vacía desenfocado.";
  let body1 =
    "Primer plano de manos de un adulto sobre una carpeta clínica y un documento con texto ilegible, ambiente de consulta española, sin rostro.";
  let body2 =
    "Sala de espera o pasillo de hospital público español vacío, sillas, cartelera desenfocada sin texto legible, atmósfera calmada y documental.";

  if (/parto|obstétr|cesárea|epidural|fetal|plexo|hemorragia/.test(t)) {
    cover =
      "Portada: habitación de maternidad vacía y en calma, cuna y monitor apagado desenfocado, luz suave de mañana, sin personas.";
    body1 = "Manos de un adulto sujetando un informe clínico sobre una mesa, anillo discreto, luz de consulta, sin rostro.";
    body2 = "Pasillo de planta de maternidad vacío, puertas cerradas, suelo brillante, ambiente hospitalario español.";
  } else if (/quirúrg|cirugía|gasa|instrumento|lado equivocado|columna|prótesis|cataratas|colonoscop|robótica/.test(t)) {
    cover =
      "Portada: quirófano vacío y ordenado después de una intervención, lámpara apagada, paños limpios, sin personas ni sangre.";
    body1 = "Bandeja de instrumental quirúrgico cerrado y limpio sobre paño verde, luz fría, sin personas.";
    body2 = "Pasillo de bloque quirúrgico vacío, puertas automáticas, ambiente hospitalario español, sin texto legible.";
  } else if (/urgencia|ictus|infarto|sepsis|ambulancia|alta hospitalaria/.test(t)) {
    cover =
      "Portada: entrada de urgencias de hospital público español de noche, rotulo desenfocado, ambulancia lejana, sin personas identificables.";
    body1 = "Silla de ruedas vacía junto a un mostrador de admisión, luz fluorescente suave, sin caras.";
    body2 = "Sala de espera de urgencias vacía a deshora, sillas, reloj de pared desenfocado, atmósfera tensa y documental.";
  } else if (/historia clínica|perito|plazo|patrimonial|mutua|indemniz|secuela/.test(t)) {
    cover =
      "Portada: despacho jurídico con expediente sanitario cerrado, sello y gafas, luz de tarde, Murcia, sin texto legible.";
    body1 = "Manos de un adulto pasando páginas de una historia clínica encuadernada, texto ilegible, sin rostro.";
    body2 = "Archivo de historiales en estantería metálica de un centro sanitario, ambiente documental.";
  } else if (/cáncer|quimio|radioterapia|diálisis|trasplante|meningitis|apendicitis/.test(t)) {
    cover =
      "Portada: consulta oncológica o de hospital de día vacía, sillón de tratamiento vacío, luz natural, sin personas.";
    body1 = "Manos sosteniendo un informe de pruebas sobre una mesa clara, sin rostro ni texto legible.";
    body2 = "Pasillo de hospital de día vacío, butacas, planta, ambiente sereno.";
  } else if (/psiquiatría|contención|residencia|mayor/.test(t)) {
    cover =
      "Portada: sala común de residencia o planta de psiquiatría vacía, sillones, luz de tarde, ambiente contenido.";
    body1 = "Manos de un adulto mayor sobre una manta y un documento clínico, sin rostro.";
    body2 = "Pasillo de residencia o planta hospitalaria vacía, barandilla, luz cálida.";
  }

  return [cover, body1, body2];
}

function figureHtml(src: string, alt: string, caption: string) {
  return `\n<figure><img src="${src}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>\n`;
}

function insertAfterNthH2(html: string, n: number, figure: string) {
  if (html.includes(figure.trim())) return html;
  let i = 0;
  return html.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi, (match) => {
    i += 1;
    return i === n ? `${match}${figure}` : match;
  });
}

async function generateWebp(openai: OpenAI, prompt: string) {
  const result = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt: `${prompt} ${LEGAL_TAIL}`,
    size: SIZE,
    quality: "high",
    output_format: "png",
    n: 1,
  });
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI no devolvió imagen");
  return sharp(Buffer.from(b64, "base64")).webp({ quality: 82 }).toBuffer();
}

export async function generateLegalBlogImages(postId: string) {
  if (!process.env.OPENAI_API_KEY) throw new Error("Falta OPENAI_API_KEY");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Falta Supabase en .env.local");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, slug, title, content, featured_image")
    .eq("id", postId)
    .single();
  if (error || !post) throw new Error(error?.message || "Post no encontrado");
  if (!post.content || post.content.length < 800) throw new Error("El artículo no tiene HTML");

  const dir = resolve(process.cwd(), "public/images/blog");
  mkdirSync(dir, { recursive: true });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const base = post.slug as string;
  const [coverPrompt, fig1Prompt, fig2Prompt] = promptsForTitle(post.title as string);
  const jobs = [
    { file: `${base}-portada.webp`, prompt: coverPrompt },
    { file: `${base}-cuerpo-1.webp`, prompt: fig1Prompt },
    { file: `${base}-cuerpo-2.webp`, prompt: fig2Prompt },
  ];

  const publicUrls: string[] = [];
  for (const job of jobs) {
    console.log("Generando", job.file);
    const webp = await generateWebp(openai, job.prompt);
    writeFileSync(resolve(dir, job.file), webp);
    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(`blog/${job.file}`, webp, { contentType: "image/webp", upsert: true });
    if (upErr) throw new Error(`Storage ${job.file}: ${upErr.message}`);
    const publicUrl = `${url}/storage/v1/object/public/images/blog/${job.file}`;
    publicUrls.push(publicUrl);
    console.log("  ", webp.length, "bytes");
  }

  const fig1 = figureHtml(
    publicUrls[1],
    "Documentación clínica sobre una mesa de consulta",
    "La prueba suele empezar por la historia clínica completa, no solo por un documento suelto."
  );
  const fig2 = figureHtml(
    publicUrls[2],
    "Pasillo o sala de espera de un centro sanitario",
    "La vía de reclamación cambia si la asistencia fue pública o privada."
  );

  let html = post.content as string;
  html = html.replace(/<figure>[\s\S]*?<\/figure>/gi, "");
  html = insertAfterNthH2(html, 3, fig1);
  html = insertAfterNthH2(html, 5, fig2);

  const { error: saveErr } = await supabase
    .from("posts")
    .update({
      featured_image: publicUrls[0],
      content: html,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);
  if (saveErr) throw new Error(saveErr.message);

  console.log("Portada:", publicUrls[0]);
}

async function main() {
  if (!POST_ID) throw new Error("Indica --post-id=UUID");
  await generateLegalBlogImages(POST_ID);
}

const invokedDirectly = process.argv[1]?.includes("generate-legal-blog-images");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
