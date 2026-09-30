<template>
  <div class="min-h-screen bg-canvas text-ink">
    <a class="fixed top-3 left-4 z-[100] -translate-y-[180%] rounded-md bg-ink px-3 py-2 text-sm text-canvas transition-transform focus:translate-y-0"
      href="#main-content">
      跳到正文
    </a>

    <SiteHeader :title="site.title" :items="navItems" :current-path="currentPath" />

    <main id="main-content">
      <HomePage v-if="isHome" :frontmatter="frontmatter" />
      <ArticlesPage v-else-if="isArticles" :frontmatter="frontmatter" />
      <ArticlePage v-else :frontmatter="frontmatter" :sidebar-groups="sidebarGroups" :current-path="currentPath">
        <Content />
      </ArticlePage>
    </main>

    <!-- <SiteFooter :title="site.title" /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import ArticlePage from './components/ArticlePage.vue'
import ArticlesPage from './components/ArticlesPage.vue'
import HomePage from './components/HomePage.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import type { NavItem, SidebarGroup } from './types'

const { site, theme, frontmatter } = useData()

console.log("🚀 ~ frontmatter:", frontmatter.value)

const route = useRoute()

const isHome = computed(() => frontmatter.value.layout === 'home')
const isArticles = computed(() => frontmatter.value.layout === 'articles')
const navItems = computed<NavItem[]>(() => theme.value.nav || [])
const sidebarGroups = computed<SidebarGroup[]>(() => theme.value.sidebar || [])
const currentPath = computed(() => normalizePath(route.path))

function normalizePath(path: string) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
}
</script>
