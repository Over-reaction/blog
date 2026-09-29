---
outline: deep
title: VitePress 实验室
description: 在 Markdown 中组合 Vue 与 VitePress 运行时能力。
category: 技术实践
date: 2026-09-26
readingTime: 约 3 分钟
---

# VitePress 实验室

VitePress 不只有静态 Markdown。你也可以在文章中使用 Vue，为内容加入轻量、克制的交互。

## 读取页面数据

`useData()` 可以读取当前站点、主题、页面与 frontmatter 数据，在 `.md` 和 `.vue` 文件中都可以使用：

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>
```

## 当前页面结果

下面的卡片直接读取当前页面数据。修改 frontmatter 后，内容也会随之更新。

<div class="data-preview">
  <span>站点名称</span>
  <strong>{{ site.title }}</strong>
  <span>页面标题</span>
  <strong>{{ frontmatter.title }}</strong>
  <span>当前路径</span>
  <strong>{{ page.relativePath }}</strong>
</div>

## 使用场景

- 在文章中创建交互式演示
- 根据页面信息显示不同内容
- 制作可以复用的 Vue 组件
- 为技术文章加入实时结果预览

## 保持克制

交互应该帮助读者理解内容，而不是分散注意力。对于个人博客来说，速度、可读性与内容本身始终更加重要。

<style>
.data-preview {
  display: grid;
  grid-template-columns: 110px 1fr;
  margin: 28px 0;
  border-top: 1px solid var(--border-strong);
}

.data-preview > * {
  padding: 13px 10px;
  border-bottom: 1px solid var(--border);
}

.data-preview span {
  color: var(--text-faint);
  font-family: var(--mono);
  font-size: 11px;
}

.data-preview strong {
  font-size: 13px;
  font-weight: 500;
}
</style>

<script setup>
import { useData } from 'vitepress'

const { site, page, frontmatter } = useData()
</script>
