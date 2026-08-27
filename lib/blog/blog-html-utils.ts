export function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&Aacute;/gi, "Á")
    .replace(/&Eacute;/gi, "É")
    .replace(/&Iacute;/gi, "Í")
    .replace(/&Oacute;/gi, "Ó")
    .replace(/&Uacute;/gi, "Ú")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&Ntilde;/gi, "Ñ")
    .replace(/&uuml;/gi, "ü")
    .replace(/&Uuml;/gi, "Ü");
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return collapseWhitespace(decodeHtmlEntities(cleaned));
}

export function countWords(html: string): number {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTimeMinutes(wordCount: number): number {
  return Math.max(4, Math.round(wordCount / 200));
}

export function extractHtmlFromModelOutput(raw: string): string {
  let text = raw.trim();
  const fenced = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) text = fenced[1].trim();
  if (!text.includes("<") && text.includes("&lt;")) {
    text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  }
  return text.trim();
}

export function asSingleRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function parseArticleUrl(articleUrl: string) {
  const url = new URL(articleUrl);
  if (!/(\.|^)gvcexpertos\.com$/i.test(url.hostname)) {
    throw new Error("La URL debe pertenecer a gvcexpertos.com");
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 3 || !["es", "en"].includes(parts[0]) || parts[1] !== "publicaciones") {
    throw new Error("La URL debe tener formato /es/publicaciones/{slug} o /en/publicaciones/{slug}");
  }
  return { slug: parts[2], locale: parts[0], canonicalUrl: url.toString() };
}
