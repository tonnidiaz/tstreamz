 /**
* Parses Markdown and retains MathJax delimiters.
* @param markdown - The Markdown string to parse.
* @returns - The parsed HTML string.
*/
export function parseMarkdown(markdown: string) {
 // Convert line breaks into HTML <br> tags
 const htmlWithLineBreaks = markdown.replace(/\n/g, '<br>');

 // Handle strong (**bold**) and emphasis (*italic*)
 const formattedHtml = htmlWithLineBreaks
   .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
   .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italics

   // Handle inline code (`code`)
   .replace(/`(.+?)`/g, '<code>$1</code>')

   // Handle code blocks (```code```)
   .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')

   // Handle headers (#, ##, ###, etc.)
   .replace(/^### (.+)$/gm, '<h3>$1</h3>')
   .replace(/^## (.+)$/gm, '<h2>$1</h2>')
   .replace(/^# (.+)$/gm, '<h1>$1</h1>');

 // Return the formatted HTML without altering MathJax content
 return formattedHtml;
}