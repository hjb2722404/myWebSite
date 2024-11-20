'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ShareButtons from './ShareButtons'
import type { BlogPost } from '@/types/blog'

interface BlogPostClientProps {
  post: BlogPost
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
      <div className="mb-8">
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
      </div>
      {children}
    </motion.div>
  )
}
