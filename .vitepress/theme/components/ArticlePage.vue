<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MobileArticleMenu from './MobileArticleMenu.vue'
import type { NavItem, OutlineItem, SidebarGroup } from '../types'

const props = defineProps<{
  frontmatter: {
    category?: string
    date?: string | Date
    readingTime?: string
  }
  sidebarGroups: SidebarGroup[]
  currentPath: string
}>()

const article = ref<HTMLElement | null>(null)
const outline = ref<OutlineItem[]>([])
const activeHeading = ref('')

const pages = computed<NavItem[]>(() => props.sidebarGroups.flatMap((group) => group.items || []))
const currentIndex = computed(() =>
  pages.value.findIndex((item) => normalizePath(item.link) === props.currentPath),
)
const previousPage = computed(() => pages.value[currentIndex.value - 1])
const nextPage = computed(() => pages.value[currentIndex.value + 1])

function normalizePath(path: string) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

function formatDate(value?: string | Date) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '.')
}

function buildOutline() {
  const headings = article.value?.querySelectorAll<HTMLHeadingElement>('h2, h3') || []
  outline.value = Array.from(headings)
    .filter((heading) => heading.id)
    .map((heading) => ({
      id: heading.id,
      text: heading.textContent?.replace(/#$/, '').trim() || '',
      level: Number(heading.tagName.slice(1)),
    }))
  updateActiveHeading()
}

function updateActiveHeading() {
  if (!outline.value.length) return
  let current = outline.value[0].id

  for (const item of outline.value) {
    const heading = document.getElementById(item.id)
    if (heading && heading.getBoundingClientRect().top <= 120) current = item.id
  }

  activeHeading.value = current
}

watch(
  () => props.currentPath,
  async () => {
    outline.value = []
    await nextTick()
    window.setTimeout(buildOutline, 40)
  },
)

onMounted(() => {
  buildOutline()
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateActiveHeading))
</script>

<template>
  <div class="mx-auto max-w-[70rem] px-6 pb-24 sm:px-8 lg:py-14">
    <MobileArticleMenu
      :outline="outline"
      :pages="pages"
      :current-path="currentPath"
      :active-heading="activeHeading"
    />

    <div class="lg:grid lg:grid-cols-[10rem_minmax(0,45rem)_10rem] lg:justify-between lg:gap-8">
      <aside class="sticky top-24 hidden max-h-[calc(100vh-7.5rem)] self-start overflow-y-auto lg:block" aria-label="文章列表">
        <p class="mb-3 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">文章</p>
        <template v-for="group in sidebarGroups" :key="group.text">
          <a
            v-for="item in group.items"
            :key="item.link"
            class="my-2 block text-[13px] leading-5 transition-colors hover:text-ink"
            :class="normalizePath(item.link) === currentPath ? 'font-semibold text-accent' : 'text-muted'"
            :href="item.link"
          >
            {{ item.text }}
          </a>
        </template>
      </aside>

      <article ref="article" class="mx-auto min-w-0 max-w-[45rem] lg:mx-0">
        <div class="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-subtle">
          <span>{{ frontmatter.category || '随笔' }}</span>
          <time v-if="frontmatter.date" :datetime="String(frontmatter.date)">{{ formatDate(frontmatter.date) }}</time>
          <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }}</span>
        </div>

        <div
          class="article-content"
          :data-pagefind-body="frontmatter.date ? '' : undefined"
        >
          <slot />
        </div>

        <nav
          v-if="previousPage || nextPage"
          class="mt-16 grid gap-3 border-t border-line pt-7 sm:grid-cols-2"
          aria-label="文章翻页"
        >
          <a
            v-if="previousPage"
            class="min-h-24 rounded-lg border border-line p-4 transition-colors hover:bg-surface"
            :href="previousPage.link"
          >
            <small class="mb-2 block text-xs text-subtle">上一篇</small>
            <span class="text-sm font-semibold">{{ previousPage.text }}</span>
          </a>
          <a
            v-if="nextPage"
            class="min-h-24 rounded-lg border border-line p-4 text-right transition-colors hover:bg-surface sm:col-start-2"
            :href="nextPage.link"
          >
            <small class="mb-2 block text-xs text-subtle">下一篇</small>
            <span class="text-sm font-semibold">{{ nextPage.text }}</span>
          </a>
        </nav>
      </article>

      <aside
        v-if="outline.length"
        class="sticky top-24 hidden max-h-[calc(100vh-7.5rem)] self-start overflow-y-auto lg:block"
        aria-label="本文目录"
      >
        <p class="mb-3 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">本文目录</p>
        <a
          v-for="item in outline"
          :key="item.id"
          class="my-2 block border-l-2 py-0.5 text-[13px] leading-5 transition-colors"
          :class="[
            activeHeading === item.id ? 'border-accent pl-3 text-accent' : 'border-transparent text-muted hover:text-ink',
            item.level === 3 ? (activeHeading === item.id ? 'pl-5' : 'pl-3') : '',
          ]"
          :href="`#${item.id}`"
        >
          {{ item.text }}
        </a>
      </aside>
    </div>
  </div>
</template>
