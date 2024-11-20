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
        console.error(`Post file not found: ${filePath}`);
        return NextResponse.json({ 
          error: 'Post not found',
          details: `File not found: ${slug}.mdx`
        }, { status: 404 })
      }

      try {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        // 验证必要的字段
        if (!data.title || !data.date) {
          console.error(`Invalid post metadata for ${slug}:`, data);
          return NextResponse.json({
            error: 'Invalid post metadata',
            details: 'Missing required fields'
          }, { status: 500 })
        }

        return NextResponse.json({
          post: {
            slug,
            content,
            ...data,
          },
        })
      } catch (error) {
        console.error(`Error reading/parsing post file ${filePath}:`, error);
        return NextResponse.json({
          error: 'Error processing post file',
          details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
      }
    } else {
      // Get all posts
      const files = fs.readdirSync(BLOG_DIR)
      const posts = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
          try {
            const filePath = path.join(BLOG_DIR, file)
            const fileContent = fs.readFileSync(filePath, 'utf8')
            const { data } = matter(fileContent)
            
            // 验证必要的字段
            if (!data.title || !data.date) {
              console.error(`Invalid post metadata for ${file}:`, data);
              return null
            }

            return {
              slug: file.replace('.mdx', ''),
              ...data,
            }
          } catch (error) {
            console.error(`Error processing file ${file}:`, error);
            return null
          }
        })
        .filter(post => post !== null) // 移除无效的文章
        .sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

      // Filter posts if search query exists
      const filteredPosts = searchQuery ? searchPosts(posts, searchQuery) : posts

      // Get all categories
      const categories = Array.from(
        new Set(posts.map((post: any) => post.category).filter(Boolean))
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
