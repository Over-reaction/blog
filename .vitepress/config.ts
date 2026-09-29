import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '拾光札记',
  description: '关于技术、设计与生活的个人博客',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#f7f5ef' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@600;700;900&display=swap',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/markdown-examples' },
      { text: '实验室', link: '/api-examples' },
      { text: '关于', link: '/about' },
    ],
    sidebar: [
      {
        text: '开始阅读',
        items: [
          { text: 'Markdown 排版指南', link: '/markdown-examples' },
          { text: 'VitePress 实验室', link: '/api-examples' },
          { text: '关于这个博客', link: '/about' },
        ],
      },
    ],
  },
})
