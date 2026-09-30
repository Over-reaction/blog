<script setup lang="ts">
import { data as allPosts } from '../../../posts.data'
import type { Topic } from '../types'
import PagefindSearch from './PagefindSearch.vue'

const posts = allPosts.slice(0, 3)

defineProps<{
  frontmatter: {
    hero?: { tagline?: string }
    topics?: Topic[]
  }
}>()
</script>

<template>
  <div class="home-page">
    <!-- <section class="mx-auto max-w-[70rem] px-6 py-20 sm:px-8 sm:py-28 lg:py-36">
      <div class="max-w-[48rem]">
        <p class="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">
          <span class="size-2 bg-accent" aria-hidden="true" />
          个人博客
        </p>
        <h1 class="m-0 text-[clamp(3rem,9vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.075em]">
          写代码，<br>也写下<span class="text-accent">思考</span>。
        </h1>
        <p class="mt-8 mb-7 max-w-[38rem] text-base leading-8 text-muted sm:text-lg">
          {{ frontmatter.hero?.tagline }}
        </p>
        <a class="inline-flex items-center gap-2 border-b border-accent pb-1 text-sm font-semibold text-ink transition-colors hover:text-accent"
          href="/articles">
          浏览所有文章 <span class="text-accent" aria-hidden="true">→</span>
        </a>
      </div>
    </section> -->

    <PagefindSearch />

    <section class="mx-auto max-w-[70rem] border-t border-line px-6 py-14 sm:px-8 sm:py-18"
      aria-labelledby="recent-posts-title">
      <!-- <div class="mb-7 flex items-end justify-between gap-6 sm:mb-9">
        <div>
          <p class="mb-2 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">最新</p>
          <h2 id="recent-posts-title"
            class="m-0 text-[clamp(2rem,5vw,3rem)] leading-tight font-semibold tracking-[-0.045em]">最近文章</h2>
        </div>
        <a class="shrink-0 border-b border-accent pb-0.5 text-sm font-semibold transition-colors hover:text-accent"
          href="/articles">查看全部</a>
      </div> -->

      <div class="border-t border-line">
        <a v-for="post in posts" :key="post.link"
          class="group grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-7 sm:py-7"
          :href="post.link">
          <time class="font-mono text-xs text-subtle sm:pt-1">{{ post.date.string }}</time>
          <div>
            <p class="mb-1 text-xs text-subtle">{{ post.category }}</p>
            <h3
              class="mb-2 text-xl leading-snug font-semibold tracking-[-0.025em] transition-colors group-hover:text-accent">
              {{ post.title }}</h3>
            <span class="block max-w-[42rem] text-[15px] leading-7 text-muted">{{ post.description }}</span>
          </div>
          <span class="hidden pt-1 text-sm text-subtle transition-colors group-hover:text-accent sm:block"
            aria-hidden="true">阅读 →</span>
        </a>
      </div>
    </section>

    <!-- <section class="mx-auto max-w-[70rem] border-t border-line px-6 py-14 sm:px-8 sm:py-18" aria-labelledby="topics-title">
      <div class="mb-7 sm:mb-8">
        <p class="mb-2 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">主题</p>
        <h2 id="topics-title" class="m-0 text-[clamp(2rem,5vw,3rem)] leading-tight font-semibold tracking-[-0.045em]">持续关注</h2>
      </div>
      <div class="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div v-for="(topic, index) in frontmatter.topics" :key="topic.title" class="group min-h-36 rounded-lg border border-line bg-surface p-6 transition-colors hover:border-accent">
          <div class="mb-7 flex items-center justify-between">
            <span class="h-0.5 w-8 bg-line-strong transition-colors group-hover:bg-accent" aria-hidden="true" />
            <span class="font-mono text-xs text-subtle">0{{ index + 1 }}</span>
          </div>
          <h3 class="mb-2 text-lg font-semibold">{{ topic.title }}</h3>
          <p class="m-0 text-sm leading-6 text-muted">{{ topic.description }}</p>
        </div>
      </div>
    </section> -->
  </div>
</template>
