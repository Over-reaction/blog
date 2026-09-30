<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { NavItem, OutlineItem } from '../types'

defineProps<{
  outline: OutlineItem[]
  pages: NavItem[]
  currentPath: string
  activeHeading: string
}>()

const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

watch(open, (value) => {
  document.documentElement.classList.toggle('menu-open', value)
})

function normalizePath(path: string) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

function close() {
  open.value = false
  nextTick(() => trigger.value?.focus())
}

async function openMenu() {
  open.value = true
  await nextTick()
  closeButton.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.documentElement.classList.remove('menu-open')
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="sticky top-16 z-40 -mx-6 mb-10 border-b border-line bg-canvas/95 backdrop-blur-md sm:-mx-8 lg:hidden">
    <button
      ref="trigger"
      class="mx-auto flex h-12 w-full max-w-[45rem] items-center justify-between px-6 text-sm font-semibold sm:px-8"
      type="button"
      :aria-expanded="open"
      aria-controls="article-menu-panel"
      @click="openMenu"
    >
      <span>文章菜单</span>
      <span class="text-xs font-normal text-subtle" aria-hidden="true">{{ outline.length }} 节 · 打开</span>
    </button>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[80]">
        <button class="absolute inset-0 size-full border-0 bg-black/55" type="button" aria-label="关闭文章菜单" @click="close" />
        <section
          id="article-menu-panel"
          class="absolute inset-x-0 bottom-0 max-h-[min(78vh,42.5rem)] overflow-y-auto rounded-t-2xl bg-canvas px-6 pt-5 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-2xl sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-menu-title"
        >
          <div class="flex items-center justify-between border-b border-line pb-4">
            <h2 id="article-menu-title" class="m-0 text-xl font-semibold">文章菜单</h2>
            <button ref="closeButton" class="rounded-md px-2 py-1 text-sm text-muted hover:bg-surface hover:text-ink" type="button" aria-label="关闭文章菜单" @click="close">
              关闭
            </button>
          </div>

          <div v-if="outline.length" class="pt-6">
            <h3 class="mb-2 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">本文目录</h3>
            <a
              v-for="item in outline"
              :key="item.id"
              class="block py-2 text-[15px] leading-6"
              :class="[
                activeHeading === item.id ? 'font-semibold text-accent' : 'text-muted',
                item.level === 3 ? 'pl-4' : '',
              ]"
              :href="`#${item.id}`"
              @click="close"
            >
              {{ item.text }}
            </a>
          </div>

          <div class="pt-6">
            <h3 class="mb-2 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">所有文章</h3>
            <a
              v-for="page in pages"
              :key="page.link"
              class="block py-2 text-[15px] leading-6"
              :class="normalizePath(page.link) === currentPath ? 'font-semibold text-accent' : 'text-muted'"
              :href="page.link"
              @click="close"
            >
              {{ page.text }}
            </a>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
