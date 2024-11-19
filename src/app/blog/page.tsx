'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import BlogList from '@/components/blog/BlogList'
import CategoryList from '@/components/blog/CategoryList'
import SearchBar from '@/components/blog/SearchBar'
import { BlogPost, BlogCategory } from '@/types/blog'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchBlogData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams()
      if (searchQuery) {
        queryParams.append('search', searchQuery)
      }
      const response = await fetch(`/api/blog?${queryParams.toString()}`)
      const data = await response.json()
      setPosts(data.posts)
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to fetch blog data:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchBlogData()
  }, [fetchBlogData])

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter(post => post.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            技术博客
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            分享前端开发、技术管理和工程实践的心得体会
          </p>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={setSearchQuery} />
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <BlogList posts={filteredPosts} />
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 dark:text-gray-400">
                没有找到相关文章
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
