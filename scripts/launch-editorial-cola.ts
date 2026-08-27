/**
 * Crea (si faltan) y redacta la cola editorial 2–50.
 * Reanudable: salta los que ya tienen cuerpo largo y portada en Storage.
 *
 *   npx tsx scripts/launch-editorial-cola.ts
 *   npx tsx scripts/launch-editorial-cola.ts --from=10 --to=24
 *   npx tsx scripts/launch-editorial-cola.ts --skip-images
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { redactBlogArticle } from "../lib/blog/redact-blog-article";
import { countWords } from "../lib/blog/blog-html-utils";
import { generateLegalBlogImages } from "./generate-legal-blog-images";

config({ path: resolve(process.cwd(), ".env.local") });

const CAT = {
  legal: "775a342c-cebe-465a-9618-556b12aeef19",
  guias: "06577db2-9686-4868-a12e-348b8c168d10",
  conceptos: "cd40a7d6-e421-4f95-9763-d6c961299014",
  indemnizaciones: "de99af51-e881-4d3f-b068-edd7fdf3d8ce",
  actualidad: "6fa63fe1-0b5f-4f12-ac6c-543d0926f58f",
} as const;

type Item = {
  n: number;
  date: string;
  title: string;
  cat: keyof typeof CAT;
};

const COLA: Item[] = [
  { n: 2, date: "2025-10-17", title: "Cómo pedir la historia clínica y qué hacer si está incompleta", cat: "guias" },
  { n: 3, date: "2025-11-01", title: "Plazos para reclamar una negligencia médica en España", cat: "legal" },
  { n: 4, date: "2025-11-16", title: "Infecciones hospitalarias: cuándo responde el centro", cat: "legal" },
  { n: 5, date: "2025-12-01", title: "Te dejaron una gasa o un instrumento: cómo se prueba", cat: "legal" },
  { n: 6, date: "2025-12-14", title: "Operación en el lado equivocado: derechos del paciente", cat: "legal" },
  { n: 7, date: "2025-12-29", title: "Diagnóstico tardío de cáncer y pérdida de oportunidad", cat: "legal" },
  { n: 8, date: "2026-01-13", title: "ICTUS: qué pasa si no te tratan a tiempo", cat: "legal" },
  { n: 9, date: "2026-01-28", title: "Infarto no detectado en urgencias", cat: "legal" },
  { n: 10, date: "2026-02-10", title: "Sepsis en el hospital: cuándo hay negligencia", cat: "legal" },
  { n: 11, date: "2026-02-24", title: "Caídas de pacientes ingresados: responsabilidad del hospital", cat: "legal" },
  { n: 12, date: "2026-03-11", title: "Úlceras por presión: lesiones evitables en cama", cat: "legal" },
  { n: 13, date: "2026-03-25", title: "Hemorragia después del parto: cuándo es negligencia", cat: "legal" },
  { n: 14, date: "2026-04-07", title: "Sufrimiento fetal y parálisis cerebral: qué se investiga", cat: "legal" },
  { n: 15, date: "2026-04-22", title: "Lesión del plexo braquial en el parto", cat: "legal" },
  { n: 16, date: "2026-05-06", title: "Cesárea que llega tarde: responsabilidad obstétrica", cat: "legal" },
  { n: 17, date: "2026-05-20", title: "Daños por una epidural mal aplicada", cat: "legal" },
  { n: 18, date: "2026-06-02", title: "Alta hospitalaria prematura: si te mandan a casa demasiado pronto", cat: "guias" },
  { n: 19, date: "2026-06-17", title: "Lista de espera: cuándo el retraso es reclamable", cat: "legal" },
  { n: 20, date: "2026-07-01", title: "El médico de cabecera no te derivó al especialista", cat: "legal" },
  { n: 21, date: "2026-07-16", title: "Qué es la pérdida de oportunidad en un caso sanitario", cat: "conceptos" },
  { n: 22, date: "2026-07-29", title: "El daño desproporcionado: cuando el resultado no encaja", cat: "conceptos" },
  { n: 23, date: "2026-08-12", title: "Cómo reclamar al Servicio Murciano de Salud (vía patrimonial)", cat: "guias" },
  { n: 24, date: "2026-08-27", title: "Sanidad pública o clínica privada: qué cambia en la reclamación", cat: "legal" },
  { n: 25, date: "2026-09-10", title: "Contenciones en psiquiatría: límites legales", cat: "legal" },
  { n: 26, date: "2026-09-25", title: "Errores en neonatología: el daño al recién nacido", cat: "legal" },
  { n: 27, date: "2026-10-08", title: "Cirugía de columna y lesión nerviosa o medular", cat: "legal" },
  { n: 28, date: "2026-10-22", title: "Infección de una prótesis de cadera o rodilla", cat: "legal" },
  { n: 29, date: "2026-11-06", title: "Cirugía estética: cuándo hay (y cuándo no) negligencia", cat: "legal" },
  { n: 30, date: "2026-11-20", title: "Complicaciones en la cirugía de cataratas", cat: "legal" },
  { n: 31, date: "2026-12-03", title: "Perforación en una colonoscopia: qué puedes reclamar", cat: "legal" },
  { n: 32, date: "2026-12-18", title: "Error en una transfusión: grupo sanguíneo y consentimiento", cat: "legal" },
  { n: 33, date: "2027-01-01", title: "Extravasación de quimioterapia: quemadura y nexo", cat: "legal" },
  { n: 34, date: "2027-01-15", title: "Error de dosis en radioterapia", cat: "legal" },
  { n: 35, date: "2027-01-30", title: "Negligencia en diálisis: protocolos y pruebas", cat: "legal" },
  { n: 36, date: "2027-02-12", title: "Trasplante: información, complicaciones y responsabilidad", cat: "legal" },
  { n: 37, date: "2027-02-26", title: "Demora de la ambulancia que agrava el daño", cat: "legal" },
  { n: 38, date: "2027-03-13", title: "Errores de atención primaria en un centro de salud de Murcia", cat: "legal" },
  { n: 39, date: "2027-03-27", title: "Consentimiento informado en menores", cat: "legal" },
  { n: 40, date: "2027-04-09", title: "Quién decide si el paciente no puede firmar", cat: "legal" },
  { n: 41, date: "2027-04-23", title: "Cómo se valoran las secuelas de un daño sanitario", cat: "indemnizaciones" },
  { n: 42, date: "2027-05-08", title: "El perito médico de parte: para qué sirve", cat: "guias" },
  { n: 43, date: "2027-05-22", title: "Cuerpo extraño postoperatorio: gasas y restos", cat: "legal" },
  { n: 44, date: "2027-06-06", title: "Meningitis no diagnosticada a tiempo", cat: "legal" },
  { n: 45, date: "2027-06-19", title: "Apendicitis que acaba en peritonitis", cat: "legal" },
  { n: 46, date: "2027-07-03", title: "Trombosis después de operar: si no hubo profilaxis", cat: "legal" },
  { n: 47, date: "2027-07-18", title: "Negligencia en residencias y pacientes mayores", cat: "legal" },
  { n: 48, date: "2027-08-01", title: "Si te diagnostica una IA: quién responde del error", cat: "actualidad" },
  { n: 49, date: "2027-08-14", title: "Cirugía robótica: consentimiento y fallos técnicos", cat: "actualidad" },
  { n: 50, date: "2027-08-29", title: "Cuando la mutua trata un daño que es sanitario", cat: "legal" },
];

function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function parseRange() {
  const from = Number(process.argv.find((a) => a.startsWith("--from="))?.slice(7) || "2");
  const to = Number(process.argv.find((a) => a.startsWith("--to="))?.slice(5) || "50");
  const skipImages = process.argv.includes("--skip-images");
  return { from, to, skipImages };
}

async function main() {
  const { from, to, skipImages } = parseRange();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Falta Supabase en .env.local");
  if (!process.env.OPENAI_API_KEY) throw new Error("Falta OPENAI_API_KEY");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const items = COLA.filter((item) => item.n >= from && item.n <= to);
  console.log(`COLA ${from}–${to}: ${items.length} artículos. Imágenes: ${skipImages ? "no" : "sí"}`);

  for (const item of items) {
    const slug = slugify(item.title);
    const publishedAt = `${item.date}T06:00:00Z`;
    console.log(`\n======== #${item.n} ${item.date} ${item.title} ========`);

    const existing = await supabase.from("posts").select("id, content, featured_image").eq("slug", slug).maybeSingle();
    let postId = existing.data?.id as string | undefined;
    if (!postId) {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: item.title,
          slug,
          excerpt: "Borrador de la cola editorial.",
          content: "<p>Pendiente de redacción.</p>",
          category_id: CAT[item.cat],
          author_id: null,
          is_published: true,
          is_featured: false,
          published_at: publishedAt,
          tags: [],
          needs_translation: true,
        })
        .select("id")
        .single();
      if (error || !data) throw new Error(`Insert #${item.n}: ${error?.message}`);
      postId = data.id;
      console.log("Creado", postId);
    } else {
      await supabase
        .from("posts")
        .update({
          published_at: publishedAt,
          is_published: true,
          category_id: CAT[item.cat],
          author_id: null,
        })
        .eq("id", postId);
      console.log("Ya existía", postId);
    }
    if (!postId) throw new Error(`Sin id #${item.n}`);

    const words = countWords(existing.data?.content || "");
    if (words < 1600) {
      const result = await redactBlogArticle({ postId });
      console.log(`COLA OK texto #${item.n}: ${result.wordCount} palabras, ${result.readingTime} min`);
    } else {
      console.log(`Texto ya listo (${words} palabras), salto redacción`);
    }

    const fresh = await supabase.from("posts").select("featured_image").eq("id", postId).single();
    const hasCover = Boolean(fresh.data?.featured_image?.includes("supabase.co/storage"));
    if (!skipImages && !hasCover) {
      await generateLegalBlogImages(postId);
      console.log(`COLA OK fotos #${item.n}`);
    } else if (hasCover) {
      console.log("Fotos ya en Storage, salto");
    }
  }

  console.log("\nCOLA HECHA", from, "–", to);
}

main().catch((err) => {
  console.error("COLA ERROR", err);
  process.exit(1);
});
