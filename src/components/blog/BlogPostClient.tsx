'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPost as BlogPostType } from '@/types/blog'
import Comments from '@/components/blog/Comments'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleStats from '@/components/blog/ArticleStats'

interface BlogPostClientProps {
  post: BlogPostType
  views: number
  children: React.ReactNode
}

export default function BlogPostClient({ post, views, children }: BlogPostClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← 返回博客列表
            </Link>
            <ShareButtons
              url={`/blog/${post.slug}`}
              title={post.title}
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between mb-4">
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
            {post?.tags?.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        {children}
        <Comments slug={post.slug} />
      </article>
    </motion.div>
  )
}
