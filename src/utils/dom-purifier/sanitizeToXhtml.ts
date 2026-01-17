import DOMPurify from "dompurify";

/**
 * Converts unsafe HTML into Flying-Saucer-safe XHTML
 */
export function sanitizeToXhtml(rawHtml: string): string {
  if (!rawHtml) {
    return "<div></div>";
  }

  // 1️⃣ Trim leading/trailing whitespace (CRITICAL)
  let html = rawHtml.trim();

  // 2️⃣ Sanitize HTML (remove scripts, invalid attrs)
  html = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    KEEP_CONTENT: true
  });

  // 3️⃣ Fix unescaped ampersands
  html = html.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g, "&amp;");

  // 4️⃣ Self-close void elements (XHTML requirement)
  html = html
    .replace(/<br\s*>/gi, "<br />")
    .replace(/<hr\s*>/gi, "<hr />")
    .replace(/<img([^>]*)>/gi, "<img$1 />")
    .replace(/<input([^>]*)>/gi, "<input$1 />");

  // 5️⃣ Wrap in single root element
  return `<div>${html}</div>`;
}
