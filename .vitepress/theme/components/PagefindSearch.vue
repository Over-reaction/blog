<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

interface PagefindResultData {
  url: string
  excerpt: string
  meta?: Record<string, string | undefined>
}

interface PagefindResultStub {
  data: () => Promise<PagefindResultData>
}

interface PagefindSearchResponse {
  results: PagefindResultStub[]
}

interface PagefindApi {
  init: () => Promise<void>
  debouncedSearch: (
    query: string,
    options?: Record<string, unknown>,
    debounceTimeout?: number,
  ) => Promise<PagefindSearchResponse | null>
}

const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const results = ref<PagefindResultData[]>([])
const resultCount = ref(0)
const isLoading = ref(false)
const hasSearched = ref(false)
const errorMessage = ref('')

const resultLabel = computed(() => `${resultCount.value} 条结果`)
const showStatus = computed(() => isLoading.value || Boolean(errorMessage.value) || hasSearched.value)

let pagefindPromise: Promise<PagefindApi> | undefined
let requestId = 0

function loadPagefind() {
  if (!pagefindPromise) {
    const pagefindUrl = withBase('/pagefind/pagefind.js')

    pagefindPromise = import(/* @vite-ignore */ pagefindUrl).then(async (pagefind: PagefindApi) => {
      await pagefind.init()
      return pagefind
    })
  }

  return pagefindPromise
}

async function prepareSearch() {
  if (pagefindPromise || errorMessage.value) return

  try {
    await loadPagefind()
  } catch {
    showLoadError()
  }
}

async function search() {
  const term = query.value.trim()
  const currentRequest = ++requestId

  if (!term) {
    resetResults()
    return
  }

  isLoading.value = true
  hasSearched.value = false
  errorMessage.value = ''
  results.value = []
  resultCount.value = 0

  try {
    const pagefind = await loadPagefind()
    const response = await pagefind.debouncedSearch(term, {}, 180)

    if (!response || currentRequest !== requestId) return

    resultCount.value = response.results.length
    const loadedResults = await Promise.all(
      response.results.slice(0, 6).map((result) => result.data()),
    )

    if (currentRequest !== requestId) return

    results.value = loadedResults
    hasSearched.value = true
  } catch {
    if (currentRequest === requestId) showLoadError()
  } finally {
    if (currentRequest === requestId) isLoading.value = false
  }
}

function clearSearch() {
  query.value = ''
  errorMessage.value = ''
  requestId += 1
  resetResults()
  input.value?.focus()
}

function resetResults() {
  results.value = []
  resultCount.value = 0
  isLoading.value = false
  hasSearched.value = false
}

function showLoadError() {
  pagefindPromise = undefined
  errorMessage.value = import.meta.env.DEV
    ? '开发模式下没有搜索索引，请运行 pnpm build 后使用 pnpm preview 预览。'
    : '搜索暂时不可用，请稍后重试。'
}

function resultUrl(url: string) {
  return withBase(url.replace(/\.html(?=($|[?#]))/, ''))
}
</script>

<template>
  <section class="mx-auto max-w-[70rem] px-6 pt-14 sm:px-8 sm:pt-18" aria-label="站内搜索">
    <div class="border-y border-line py-8 sm:py-10">
      <div class="mx-auto max-w-[52rem]">
        <form role="search" @submit.prevent="search">
          <label class="sr-only" for="pagefind-search-input">搜索全部文章</label>
          <div class="relative">
            <svg class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-subtle"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>

            <input id="pagefind-search-input" ref="input" v-model="query"
              class="h-13 w-full rounded-lg border border-line bg-surface pr-12 pl-12 text-[15px] transition-colors placeholder:text-subtle hover:border-line-strong focus:border-accent focus:bg-canvas focus:outline-none"
              type="text" inputmode="search" autocomplete="off" placeholder="输入标题、技术或关键词…"
              :aria-describedby="showStatus ? 'search-status' : undefined" @focus="prepareSearch" @input="search">

            <button v-if="query"
              class="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-hover hover:text-ink"
              type="button" aria-label="清空搜索" @click="clearSearch">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </form>

        <div v-if="showStatus" id="search-status" class="mt-3 min-h-5 text-xs text-subtle" role="status"
          aria-live="polite">
          <span v-if="isLoading">正在搜索…</span>
          <span v-else-if="errorMessage">{{ errorMessage }}</span>
          <span v-else-if="hasSearched">{{ resultLabel }}</span>
        </div>

        <ul v-if="results.length" class="mt-4 divide-y divide-line border-t border-line" aria-label="搜索结果">
          <li v-for="result in results" :key="result.url">
            <a class="group block py-5" :href="resultUrl(result.url)">
              <span class="flex items-center justify-between gap-4">
                <strong class="text-base font-semibold transition-colors group-hover:text-accent">
                  {{ result.meta?.title || '未命名文章' }}
                </strong>
                <span class="shrink-0 text-sm text-subtle transition-colors group-hover:text-accent" aria-hidden="true">
                  阅读 →
                </span>
              </span>
              <span
                class="mt-1.5 block text-sm leading-6 text-muted [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-ink"
                v-html="result.excerpt" />
            </a>
          </li>
        </ul>

        <p v-else-if="hasSearched && !isLoading" class="mt-5 border-t border-line pt-5 text-sm text-muted">
          没有找到相关内容，试试更短或更通用的关键词。
        </p>
      </div>
    </div>
  </section>
</template>
