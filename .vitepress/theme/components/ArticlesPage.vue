<template>
  <div class="mx-auto max-w-[70rem] px-6 py-16 sm:px-8 sm:py-24">
    <section class="border-t border-line" aria-label="文章列表">
      <a v-for="post in posts" :key="post.link"
        class="group grid grid-cols-1 gap-2 border-b border-line py-7 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-7 sm:py-8"
        :href="post.link">
        <time class="font-mono text-xs text-subtle sm:pt-1.5">{{ post.date.string }}</time>
        <div>
          <p class="mb-1 text-xs text-subtle">{{ post.category }}</p>
          <h2 class="mb-2 text-2xl leading-snug font-semibold tracking-[-0.03em] group-hover:text-accent">{{ post.title
          }}</h2>
          <span class="block max-w-[42rem] text-[15px] leading-7 text-muted">{{ post.description }}</span>
        </div>
        <span class="hidden pt-1 text-sm text-subtle sm:block" aria-hidden="true">阅读 →</span>
      </a>
    </section>
  </div>
</template>


<script setup lang="ts">
import { data as posts } from '../../../posts.data'

defineProps<{
  frontmatter: {
    title?: string
    description?: string
  }
}>()
</script>
