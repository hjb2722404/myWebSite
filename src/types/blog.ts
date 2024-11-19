export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  category: string
  author: string
  readingTime: string
  views?: number
}

export type BlogCategory = {
  name: string
  count: number
}
