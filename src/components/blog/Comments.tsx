'use client'

import { useEffect, useState } from 'react'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">评论</h2>
      <Giscus
        id={slug}
        repo="your-github-username/your-repo-name"
        repoId="your-repo-id"
        category="Announcements"
        categoryId="your-category-id"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
