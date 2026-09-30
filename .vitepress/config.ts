import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  lang: 'zh-CN',
  title: 'chen',
  description: '在代码、设计与日常之间，记录仍然值得思考的事。',
  cleanUrls: true,
  lastUpdated: true,
  rewrites: {
    'posts/:path*': ':path*',
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23181818'/%3E%3Cpath d='M43 23c-3-3-6-5-11-5-8 0-14 6-14 14s6 14 14 14c5 0 9-2 12-6l-6-5c-2 2-3 3-6 3-3 0-6-3-6-6s3-6 6-6c2 0 4 1 5 3z' fill='white'/%3E%3C/svg%3E",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      // { text: '文章', link: '/articles' },
      { text: '实验室', link: '/api-examples' },
    ],
    sidebar: [
      {
        text: '文章',
        items: [
          { text: 'Markdown 排版指南', link: '/markdown-examples' },
          { text: 'VitePress 实验室', link: '/api-examples' },
          { text: 'git提交规范', link: '/git' },
        ],
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
