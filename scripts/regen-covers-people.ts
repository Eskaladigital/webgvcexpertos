import { config } from "dotenv";
import { resolve } from "path";
import { generateLegalBlogImages } from "./generate-legal-blog-images";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!ids.length) throw new Error("Pasa uno o más UUID");

  for (const id of ids) {
    console.log("PORTADA PERSONAS", id);
    await generateLegalBlogImages(id, { coverOnly: true });
  }
  console.log("PORTADAS HECHAS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
