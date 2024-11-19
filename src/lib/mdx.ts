import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
  category: string
  content: string
}

export interface BlogCategory {
  name: string
  count: number
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(BLOG_DIR)
  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      return await getPostBySlug(slug)
    })
  )

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const mdxSource = await serialize(content)

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    author: data.author,
    tags: data.tags,
    category: data.category,
    content: mdxSource.compiledSource,
  }
}

export function getAllCategories(): BlogCategory[] {
  const files = fs.readdirSync(BLOG_DIR)
  const categories = new Map<string, number>()

  files.forEach((filename) => {
    const fullPath = path.join(BLOG_DIR, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    const category = data.category

    categories.set(category, (categories.get(category) || 0) + 1)
  })

  return Array.from(categories.entries()).map(([name, count]) => ({
    name,
    count,
  }))
}

export function getAllTags(): string[] {
  const files = fs.readdirSync(BLOG_DIR)
  const tagsSet = new Set<string>()

  files.forEach((filename) => {
    const fullPath = path.join(BLOG_DIR, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    data.tags.forEach((tag: string) => tagsSet.add(tag))
  })

  return Array.from(tagsSet)
}
