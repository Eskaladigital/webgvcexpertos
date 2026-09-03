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
const ART_DIRECTOR_MODEL = process.env.OPENAI_IMAGE_ART_DIRECTOR_MODEL?.trim() || "gpt-5.6-terra";
const SIZE = "1536x1024" as const;

const LEGAL_TAIL =
  "Fotografía editorial documental hiperrealista, horizontal, de contexto sanitario español. Sin texto, logos, marcas, letras ni marcas de agua. Sin sangre, heridas abiertas ni procedimientos gráficos. No ilustración ni collage. Prohibido mostrar abogados, despachos, contratos, carpetas legales, reuniones cara a cara o apretones de manos.";

function plainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function artDirection(openai: OpenAI, title: string, html: string) {
  const response = await openai.responses.create({
    model: ART_DIRECTOR_MODEL,
    instructions: `Eres director de arte de una revista de salud y derecho sanitario. Lee el artículo y decide qué única escena visual, concreta y original representa mejor su tesis.

Devuelve exclusivamente una descripción de 55 a 85 palabras en español para generar una fotografía editorial horizontal. Elige un momento, espacio, objeto o persona directamente relacionado con el contenido; no ilustres el título de forma obvia. Busca variedad real de localización, hora, escala, encuadre y protagonista. Evita los clichés repetidos: ambulancia nocturna, pasillo de hospital, sala de espera y consulta. Nunca abogado, despacho, documentos legales, reunión de clientes, texto, logos, sangre, fluidos corporales, heridas, agujas o procedimientos invasivos.`,
    input: `TÍTULO: ${title}\n\nARTÍCULO:\n${plainText(html).slice(0, 7000)}`,
    max_output_tokens: 250,
    reasoning: { effort: "low" },
  });
  const prompt = response.output_text?.trim();
  if (!prompt) throw new Error("El director de arte no devolvió un prompt");
  return prompt;
}

async function promptsForArticle(openai: OpenAI, title: string, html: string): Promise<[string, string, string]> {
  const cover = await artDirection(openai, title, html);
  return [
    cover,
    "Figura editorial complementaria del artículo: detalle clínico o arquitectónico diferente de la portada, sin texto legible ni personas reunidas.",
    "Segunda figura editorial complementaria: otro espacio u objeto sanitario diferente de la portada y de la primera figura, sin texto legible.",
  ];
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

export async function generateLegalBlogImages(postId: string, opts: { coverOnly?: boolean } = {}) {
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
  const [coverPrompt, fig1Prompt, fig2Prompt] = await promptsForArticle(
    openai,
    post.title as string,
    post.content as string
  );
  console.log("Dirección de arte:", coverPrompt);
  const jobs = opts.coverOnly
    ? [{ file: `${base}-portada.webp`, prompt: coverPrompt }]
    : [
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

  const payload: Record<string, unknown> = {
    // Al sustituir un archivo en Storage, cambia la URL para que el CDN y el
    // navegador no muestren la portada anterior desde caché.
    featured_image: `${publicUrls[0]}?v=3`,
    updated_at: new Date().toISOString(),
  };

  if (!opts.coverOnly && publicUrls[1] && publicUrls[2]) {
    const fig1 = figureHtml(
      publicUrls[1],
      "Abogado y cliente revisan documentación clínica en consulta",
      "La prueba suele empezar por la historia clínica completa, no solo por un documento suelto."
    );
    const fig2 = figureHtml(
      publicUrls[2],
      "Personas en la sala de espera de un centro sanitario",
      "La vía de reclamación cambia si la asistencia fue pública o privada."
    );
    let html = post.content as string;
    html = html.replace(/<figure>[\s\S]*?<\/figure>/gi, "");
    html = insertAfterNthH2(html, 3, fig1);
    html = insertAfterNthH2(html, 5, fig2);
    payload.content = html;
  }

  const { error: saveErr } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", postId);
  if (saveErr) throw new Error(saveErr.message);

  console.log("Portada:", publicUrls[0]);
}

async function main() {
  if (!POST_ID) throw new Error("Indica --post-id=UUID");
  await generateLegalBlogImages(POST_ID, { coverOnly: process.argv.includes("--cover-only") });
}

const invokedDirectly = process.argv[1]?.includes("generate-legal-blog-images");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
