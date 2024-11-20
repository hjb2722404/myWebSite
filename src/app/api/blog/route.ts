import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

function searchPosts(posts: any[], searchQuery: string) {
  const query = searchQuery.toLowerCase()
  return posts.filter((post) => {
    const searchContent = `${post.title} ${post.excerpt} ${post.category} ${
      post.tags?.join(' ') || ''
    }`.toLowerCase()
    return searchContent.includes(query)
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const searchQuery = searchParams.get('search')

  try {
    // 检查博客目录是否存在
    if (!fs.existsSync(BLOG_DIR)) {
      console.error(`Blog directory not found: ${BLOG_DIR}`);
      return NextResponse.json({ 
        posts: [],
        categories: [],
        error: 'Blog directory not found' 
      });
    }

    if (slug) {
      // Get single post
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)

      return NextResponse.json({
        post: {
          slug,
          content,
          ...data,
        },
      })
    } else {
      // Get all posts
      const files = fs.readdirSync(BLOG_DIR)
      const posts = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
          const filePath = path.join(BLOG_DIR, file)
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data } = matter(fileContent)
          return {
            slug: file.replace('.mdx', ''),
            ...data,
          }
        })
        .sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

      // Filter posts if search query exists
      const filteredPosts = searchQuery ? searchPosts(posts, searchQuery) : posts

      // Get all categories
      const categories = Array.from(
        new Set(posts.map((post: any) => post.category))
      ).map(category => ({
        name: category,
        count: posts.filter((post: any) => post.category === category).length,
      }))

      return NextResponse.json({
        posts: filteredPosts,
        categories,
      })
    }
  } catch (error) {
    console.error('Error processing blog request:', error)
    return NextResponse.json(
      { 
        posts: [],
        categories: [],
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
