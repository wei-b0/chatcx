export function splitMessageIntoChunks(
  message: string,
  maxLength: number
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  const htmlContent = message
    .replace(/^### (.*$)/gm, "<b><u>$1</u></b>")
    .replace(/^## (.*$)/gm, "<b><u>$1</u></b>")
    .replace(/^#### (.*$)/gm, "<b>$1</b>")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/```[\s\S]*?```/g, (match) => {
      return "<pre>" + match.slice(3, -3) + "</pre>";
    })
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/^\s*[•-]\s+(.*$)/gm, "- $1")
    .replace(/^\d+\.\s+(.*$)/gm, "• $1")
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
