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
  "Fotografía editorial hiperrealista, luz natural suave, tono serio y profesional. Debe verse al menos una cara humana (abogado, paciente o familiar), aspecto mediterráneo, 35-65 años. No copies a nadie famoso ni al equipo de un bufete concreto. Sin texto, logos, marcas ni letras. Sin sangre, heridas ni quirófano cruento. No ilustración.";

function peopleCover(title: string): string {
  const t = title.toLowerCase();
  const n = [...title].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
  if (/parto|obstétr|cesárea|epidural|fetal|plexo|hemorragia/.test(t)) {
    return n % 2 === 0
      ? "Portada: abogada de unos 40 años con blazer oscuro escucha a una madre joven en un despacho, cara de ambas visible, carpeta en la mesa, luz de tarde."
      : "Portada: pareja de 30 años sentada frente a un abogado de 50 en consulta, caras visibles, ambiente de despacho murciano, sin texto.";
  }
  if (/quirúrg|cirugía|gasa|instrumento|lado equivocado|columna|prótesis|cataratas|colonoscop|robótica/.test(t)) {
    return n % 2 === 0
      ? "Portada: cirujano de 45 años de espaldas parcial y un familiar escuchando en un despacho hospitalario, caras visibles, tono grave, sin sangre."
      : "Portada: cliente hombre de 55 años y abogada de 40 revisan un informe sobre la mesa, caras visibles, despacho jurídico-sanitario.";
  }
  if (/urgencia|ictus|infarto|sepsis|ambulancia|alta hospitalaria/.test(t)) {
    return "Portada: mujer de 50 años preocupada en sala de espera de urgencias y un abogado de traje acercándose a hablarle, caras visibles, hospital español.";
  }
  if (/historia clínica|perito|plazo|patrimonial|mutua|indemniz|secuela/.test(t)) {
    return n % 2 === 0
      ? "Portada: abogado de 55 años con traje oscuro explica un expediente a un cliente de 60, ambas caras visibles, despacho en Murcia, luz de ventana."
      : "Portada: clienta de 45 años frente a una abogada, conversación seria, caras visibles, estantería de libros jurídicos al fondo.";
  }
  if (/cáncer|quimio|radioterapia|diálisis|trasplante|meningitis|apendicitis/.test(t)) {
    return "Portada: paciente de 50 años y su pareja escuchan a una abogada en consulta, tres caras visibles, ambiente cálido de despacho, no hospital de día vacío.";
  }
  if (/psiquiatría|contención|residencia|mayor/.test(t)) {
    return "Portada: abogada habla con un adulto mayor y su hija en un despacho, caras visibles, tono cercano y serio.";
  }
  const covers = [
    "Portada: abogado de 50 años de traje escucha a una clienta de 40 frente a frente, caras visibles, mesa de despacho, Murcia, luz natural.",
    "Portada: abogada de 38 años con blazer y un cliente mayor revisan papeles, ambas caras visibles, no recortes de manos solas.",
    "Portada: pareja en consulta con un abogado, tres personas, caras visibles, ambiente jurídico-sanitario profesional.",
    "Portada: primer plano de un abogado hablando con un paciente en silla de ruedas en un pasillo de hospital, caras visibles, tono documental.",
  ];
  return covers[n];
}

function promptsForTitle(title: string): [string, string, string] {
  const cover = peopleCover(title);
  const body1 =
    "Consulta en un despacho: abogado y cliente sentados, caras visibles, carpeta clínica en la mesa, texto ilegible, luz suave.";
  const body2 =
    "Sala de espera de hospital con dos o tres personas sentadas, caras visibles, atmósfera calmada, sin cartelera legible.";
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
  const [coverPrompt, fig1Prompt, fig2Prompt] = promptsForTitle(post.title as string);
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
    featured_image: `${publicUrls[0]}?v=2`,
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
