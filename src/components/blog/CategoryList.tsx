'use client'

import { motion } from 'framer-motion'
import { BlogCategory } from '@/types/blog'

interface CategoryListProps {
  categories: BlogCategory[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        分类
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        {categories.map(category => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>
    </motion.div>
  )
}
