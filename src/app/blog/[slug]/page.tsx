'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { BlogPost } from '@/types/blog'
import Comments from '@/components/blog/Comments'

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
  code: (props: any) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto mb-4" {...props} />
  ),
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [mdxSource, setMdxSource] = useState<any>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog?slug=${slug}`)
        const data = await response.json()
        setPost(data.post)
        if (data.post?.content) {
          const mdxSource = await serialize(data.post.content)
          setMdxSource(mdxSource)
        }
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!post || !mdxSource) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            文章未找到
          </h1>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote {...mdxSource} components={components} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← 返回博客列表
          </Link>
        </motion.div>

        <Comments slug={slug} />
      </article>
    </div>
  )
}
