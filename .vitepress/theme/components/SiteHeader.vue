<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NavItem } from '../types'

const props = defineProps<{
  title: string
  items: NavItem[]
  currentPath: string
}>()

const menuOpen = ref(false)

watch(
  () => props.currentPath,
  () => {
    menuOpen.value = false
  },
)

function normalizePath(path: string) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

function isActive(link: string) {
  const target = normalizePath(link)
  return target === '/' ? props.currentPath === '/' : props.currentPath.startsWith(target)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-[70rem] items-center justify-between px-6 sm:px-8">
      <a
        class="text-lg font-bold tracking-[-0.03em] transition-opacity hover:opacity-60"
        href="/"
        :aria-label="`${title} 首页`"
      >
        {{ title }}
      </a>

      <nav class="hidden items-center gap-7 sm:flex" aria-label="主导航">
        <a
          v-for="item in items"
          :key="item.link"
          class="relative py-5 text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent after:transition-transform"
          :class="isActive(item.link) ? 'text-accent after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-ink'"
          :href="item.link"
        >
          {{ item.text }}
        </a>
      </nav>

      <button
        class="grid size-10 content-center gap-1.5 rounded-md p-2 sm:hidden"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        :aria-label="menuOpen ? '关闭导航' : '打开导航'"
        @click="menuOpen = !menuOpen"
      >
        <span class="block h-px w-full bg-ink transition-transform" :class="{ 'translate-y-[3.5px] rotate-45': menuOpen }" />
        <span class="block h-px w-full bg-ink transition-transform" :class="{ '-translate-y-[3.5px] -rotate-45': menuOpen }" />
      </button>
    </div>

    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="border-t border-line bg-canvas sm:hidden"
      aria-label="移动端导航"
    >
      <div class="mx-auto grid max-w-[70rem] px-6 py-2">
        <a
          v-for="item in items"
          :key="item.link"
          class="border-b border-line py-3 text-[15px] last:border-b-0"
          :class="isActive(item.link) ? 'font-semibold text-accent' : 'text-muted'"
          :href="item.link"
        >
          {{ item.text }}
        </a>
      </div>
    </nav>
  </header>
</template>
