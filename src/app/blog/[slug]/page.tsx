'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { serialize } from 'next-mdx-remote/serialize'
import type { BlogPost as BlogPostType } from '@/types/blog'
import Comments from '@/components/blog/Comments'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleStats from '@/components/blog/ArticleStats'
import MDXContent from '@/components/blog/MDXContent'
import BlogPostClient from '@/components/blog/BlogPostClient'

const components = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold mb-4 mt-8" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold mb-3 mt-6" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-bold mb-2 mt-4" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4 ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4 ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="mb-1" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => {
    if (props.className) {
      // 如果有className，说明是代码块
      return <CodeBlock {...props} />
    }
    // 否则是行内代码
    return <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 font-mono text-sm" {...props} />
  },
  pre: (props: any) => {
    // 移除默认的pre样式，让CodeBlock组件处理样式
    const { children, ...rest } = props
    return children
  },
}

export async function generateStaticParams() {
  const response = await fetch(`/api/blog`)
  const data = await response.json()
  return data.posts.map((post: BlogPostType) => ({
    slug: post.slug,
  }))
}

export const revalidate = 3600 // 每小时重新验证一次

async function getPost(slug: string) {
  const response = await fetch(`/api/blog?slug=${slug}`, {
    next: { revalidate }
  })
  const data = await response.json()
  return data.post
}

async function getViews(slug: string) {
  const response = await fetch(`/api/views?slug=${slug}`, {
    next: { revalidate }
  })
  const data = await response.json()
  return data.views
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  const views = await getViews(params.slug)
  const source = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-2xl">Post not found</h1>
      </div>
    )
  }

  return (
    <BlogPostClient post={post} views={views}>
      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <ArticleStats
              publishDate={post.date}
              views={views}
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post?.tags?.map(tag: string => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <MDXContent source={source} />
        <Comments slug={params.slug} />
      </article>
    </BlogPostClient>
  )
}
