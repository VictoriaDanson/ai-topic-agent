import { marked } from 'marked'

/**
 * 解析 Markdown 为 HTML
 */
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string
}

/**
 * 安全解析 Markdown（处理异常）
 */
export function safeParseMarkdown(markdown: string): string {
  try {
    return parseMarkdown(markdown)
  } catch (error) {
    console.error('Markdown 解析失败:', error)
    return markdown
  }
}
