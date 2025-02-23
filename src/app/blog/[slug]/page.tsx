import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import type { BlogPost as BlogPostType } from '@/types/blog'
import Comments from '@/components/blog/Comments'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleStats from '@/components/blog/ArticleStats'
import CodeBlock from '@/components/blog/CodeBlock'

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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch blog posts:', await response.text());
      return [];
    }
    
    const data = await response.json();
    if (!data.posts) {
      console.error('Invalid response format:', data);
      return [];
    }
    
    return data.posts.map((post: BlogPostType) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export const revalidate = 3600 // 每小时重新验证一次

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate },
      cache: 'no-cache'
    });

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getViews(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/views?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate },
      cache: 'no-cache'
    });

    if (!response.ok) {
      console.error(`Failed to fetch views: ${response.status} ${response.statusText}`);
      return 0;
    }

    const data = await response.json();
    return data.views || 0;
  } catch (error) {
    console.error('Error fetching views:', error);
    return 0;
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug);
    
    if (!post) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <h1 className="text-2xl">文章未找到</h1>
        </div>
      );
    }

    const views = await getViews(params.slug);
    
    if (!post.content) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <h1 className="text-2xl">文章内容为空</h1>
        </div>
      );
    }

    const mdxSource = await serialize(post.content);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white dark:bg-gray-900"
      >
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="mb-8">
                <ArticleStats
                  content={post.content || ''}
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
                {post?.tags?.map((tag: string) => (
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
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← 返回博客列表
              </Link>
              <ShareButtons
                url={`/blog/${params.slug}`}
                title={post.title}
              />
            </div>
          </motion.div>

          <Comments slug={params.slug} />
        </article>
      </motion.div>
    )
  } catch (error) {
    console.error('Error rendering blog post:', error);
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-2xl">错误</h1>
      </div>
    );
  }
}
