import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  description: string
  category: string
  link: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter.title && frontmatter.date)
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        description: frontmatter.description ?? '',
        category: frontmatter.category ?? '未分类',
        link: url,
        date: formatDate(frontmatter.date),
        excerpt,
      }))
      .sort((a, b) => b.date.time - a.date.time)
  },
})

function formatDate(raw: string): Post['date'] {
  const date = new Date(raw)

  // Keep date-only frontmatter stable across local time zones.
  date.setUTCHours(12)

  return {
    time: date.getTime(),
    string: date
      .toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replaceAll('/', '.'),
  }
}
