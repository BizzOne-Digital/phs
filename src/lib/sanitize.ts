import sanitizeHtmlLib from "sanitize-html";

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "figure",
      "figcaption",
      "span",
    ]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading", "class"],
      a: ["href", "name", "target", "rel", "class"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

export function stripHtml(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} });
}
