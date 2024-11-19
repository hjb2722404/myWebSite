'use client'

import { useState } from 'react'
import {
  TwitterShareButton,
  TwitterIcon,
  WeiboShareButton,
  WeiboIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share'
import { QRCodeSVG } from 'qrcode.react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [showQRCode, setShowQRCode] = useState(false)

  return (
    <div className="relative">
      <div className="flex space-x-4 items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">分享到：</span>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WeiboShareButton url={url} title={title}>
          <WeiboIcon size={32} round />
        </WeiboShareButton>
        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <RedditShareButton url={url} title={title}>
          <RedditIcon size={32} round />
        </RedditShareButton>
        <EmailShareButton url={url} subject={title}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <button
          onClick={() => setShowQRCode(!showQRCode)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2DC100] hover:bg-[#299900] transition-colors"
          title="分享到微信"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8.2,13.3c-0.3,0-0.6-0.2-0.6-0.5c0-0.3,0.3-0.5,0.6-0.5c0.4,0,0.6,0.2,0.6,0.5C8.8,13.1,8.6,13.3,8.2,13.3z M12.9,13.3 c-0.3,0-0.6-0.2-0.6-0.5c0-0.3,0.3-0.5,0.6-0.5c0.3,0,0.6,0.2,0.6,0.5C13.5,13.1,13.2,13.3,12.9,13.3z M8.2,13.3 c-0.3,0-0.6-0.2-0.6-0.5c0-0.3,0.3-0.5,0.6-0.5c0.4,0,0.6,0.2,0.6,0.5C8.8,13.1,8.6,13.3,8.2,13.3z M12.9,13.3 c-0.3,0-0.6-0.2-0.6-0.5c0-0.3,0.3-0.5,0.6-0.5c0.3,0,0.6,0.2,0.6,0.5C13.5,13.1,13.2,13.3,12.9,13.3z M16.5,16.1 c0-2.8-2.8-5-6.2-5c-3.4,0-6.2,2.2-6.2,5c0,2.8,2.8,5,6.2,5c0.7,0,1.4-0.1,2.1-0.3l1.9,1.1c0.1,0,0.1,0,0.2,0 c0.1,0,0.2-0.1,0.2-0.2c0-0.1,0-0.1,0-0.2l-0.5-1.6C15.4,18.9,16.5,17.6,16.5,16.1z M21.5,10c0-2.3-2.3-4.1-5.2-4.1 c-2.9,0-5.2,1.8-5.2,4.1c0,2.3,2.3,4.1,5.2,4.1c0.6,0,1.1-0.1,1.7-0.2l1.6,0.9c0.1,0,0.1,0,0.2,0c0.1,0,0.2-0.1,0.2-0.2 c0-0.1,0-0.1,0-0.1l-0.4-1.3C20.6,12.4,21.5,11.3,21.5,10z M13.9,9.8c-0.4,0-0.7-0.3-0.7-0.6c0-0.3,0.3-0.6,0.7-0.6 c0.4,0,0.7,0.3,0.7,0.6C14.6,9.5,14.3,9.8,13.9,9.8z M17.8,9.8c-0.4,0-0.7-0.3-0.7-0.6c0-0.3,0.3-0.6,0.7-0.6 c0.4,0,0.7,0.3,0.7,0.6C18.5,9.5,18.2,9.8,17.8,9.8z" />
          </svg>
        </button>
      </div>

      {/* 微信二维码弹窗 */}
      {showQRCode && (
        <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10">
          <div className="text-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              微信扫码分享
            </span>
          </div>
          <QRCodeSVG
            value={url}
            size={128}
            level="L"
            includeMargin={true}
            className="bg-white p-2 rounded"
          />
          <button
            onClick={() => setShowQRCode(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
