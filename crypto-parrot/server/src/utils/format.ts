export function splitMessageIntoChunks(
  message: string,
  maxLength: number
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Convert Markdown headers and formatting to HTML
  const htmlContent = message
    // Headers
    .replace(/^### (.*$)/gm, "<b><u>$1</u></b>")
    .replace(/^## (.*$)/gm, "<b><u>$1</u></b>")
    .replace(/^#### (.*$)/gm, "<b>$1</b>")
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      return "<pre>" + match.slice(3, -3) + "</pre>";
    })
    // Inline code
    .replace(/`(.*?)`/g, "<code>$1</code>")
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Bullet points
    .replace(/^\s*[•-]\s+(.*$)/gm, "- $1")
    // Numbered lists
    .replace(/^\d+\.\s+(.*$)/gm, "• $1")
    // Add line breaks for readability
    .replace(/\n\n/g, "\n\n");

  htmlContent.split("\n").forEach((line) => {
    if (currentChunk.length + line.length + 1 > maxLength) {
      chunks.push(currentChunk);
      currentChunk = "";
    }
    currentChunk += (currentChunk ? "\n" : "") + line;
  });

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
