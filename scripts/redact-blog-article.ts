/**
 * Redacta o reescribe el contenido HTML (ES) de un artículo de publicaciones.
 * No genera portadas. No toca la versión inglesa (usa el traductor del admin después).
 *
 * Uso:
 *   npx tsx scripts/redact-blog-article.ts "https://www.gvcexpertos.com/es/publicaciones/SLUG"
 *   npx tsx scripts/redact-blog-article.ts --slug=mi-slug-del-articulo
 *   npx tsx scripts/redact-blog-article.ts --post-id=UUID
 *   npx tsx scripts/redact-blog-article.ts "url" --dry-run
 *   npx tsx scripts/redact-blog-article.ts "url" --seo-only
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

function parseArgs() {
  const args = process.argv.slice(2);
  let articleUrl: string | undefined;
  let slug: string | undefined;
  let postId: string | undefined;
  let dryRun = false;
  let seoOnly = false;

  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--seo-only") seoOnly = true;
    else if (arg.startsWith("--slug=")) slug = arg.slice("--slug=".length).trim() || undefined;
    else if (arg.startsWith("--post-id=")) postId = arg.slice("--post-id=".length).trim() || undefined;
    else if (arg.startsWith("http")) articleUrl = arg;
    else if (!arg.startsWith("--")) slug = arg;
  }

  return { articleUrl, slug, postId, dryRun, seoOnly };
}

async function main() {
  const { articleUrl, slug, postId, dryRun, seoOnly } = parseArgs();
  if (!articleUrl && !slug && !postId) {
    console.error("❌ Indica URL del artículo, --slug=... o --post-id=...");
    process.exit(1);
  }

  const { redactBlogArticle } = await import("../lib/blog/redact-blog-article");
  const result = await redactBlogArticle({ articleUrl, slug, postId, dryRun, seoOnly });

  console.log("\n=== RESULTADO ===");
  console.log("Título:", result.title);
  console.log("Slug:", result.slug);
  console.log("Palabras:", result.wordCount);
  console.log("Lectura:", result.readingTime, "min");
  console.log("Modelo:", result.model, "| temp:", result.temperature);
  console.log("Meta title:", result.metaTitle);
  console.log("Meta description:", result.metaDescription);
  console.log("Meta keywords:", result.metaKeywords.join(", "));
  console.log("Resumen:", result.excerpt);
  console.log("Actualizado en Supabase:", result.updated ? "sí" : "no (dry-run)");
  console.log("Preview:", result.contentPreview);

  if (dryRun) {
    const { writeFileSync } = await import("fs");
    const { join } = await import("path");
    const out = join(process.env.TEMP || process.env.TMP || ".", `redact-${result.slug}.html`);
    writeFileSync(out, result.content, "utf8");
    console.log("HTML dry-run:", out);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
