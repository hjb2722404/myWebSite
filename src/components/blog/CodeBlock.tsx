'use client'

import { Highlight, themes } from 'prism-react-renderer'
import { useTheme } from 'next-themes'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

export default function CodeBlock({ children, className, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  // 从className中提取语言，格式如 "language-javascript"
  const match = /language-(\w+)/.exec(className || '')
  const lang = language || (match ? match[1] : 'text')

  return (
    <Highlight
      theme={resolvedTheme === 'dark' ? themes.nightOwl : themes.github}
      code={children.trim()}
      language={lang as any}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative group">
          <button
            onClick={() => navigator.clipboard.writeText(children.trim())}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            title="复制代码"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </button>
          <pre
            className={`${className} rounded-lg p-4 overflow-x-auto`}
            style={{
              ...style,
              backgroundColor: resolvedTheme === 'dark' ? '#011627' : '#f6f8fa',
            }}
          >
            <code className={className}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 select-none opacity-50 text-right mr-4">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  )
}
