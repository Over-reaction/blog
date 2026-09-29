<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

interface NavItem {
  text: string
  link: string
}

interface OutlineItem {
  id: string
  text: string
  level: number
}

const { site, theme, frontmatter, isDark } = useData()
const route = useRoute()
const article = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
const outline = ref<OutlineItem[]>([])
const activeHeading = ref('')

const isHome = computed(() => frontmatter.value.layout === 'home')
const navItems = computed<NavItem[]>(() => theme.value.nav || [])
const sidebarGroups = computed(() => theme.value.sidebar || [])
const currentPath = computed(() => route.path.replace(/\.html$/, '').replace(/\/$/, '') || '/')

const flatPages = computed<NavItem[]>(() =>
  sidebarGroups.value.flatMap((group: { items?: NavItem[] }) => group.items || []),
)

const currentIndex = computed(() =>
  flatPages.value.findIndex((item) => normalizePath(item.link) === currentPath.value),
)
const previousPage = computed(() => flatPages.value[currentIndex.value - 1])
const nextPage = computed(() => flatPages.value[currentIndex.value + 1])

function normalizePath(path: string) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

function isActive(link: string) {
  if (link === '/') return currentPath.value === '/'
  return currentPath.value.startsWith(normalizePath(link))
}

function toggleTheme() {
  isDark.value = !isDark.value
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
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
    if (heading && heading.getBoundingClientRect().top <= 140) current = item.id
  }

  activeHeading.value = current
}

watch(
  () => route.path,
  async () => {
    menuOpen.value = false
    outline.value = []
    await nextTick()
    window.setTimeout(buildOutline, 80)
  },
)

onMounted(() => {
  buildOutline()
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateActiveHeading))
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">跳到正文</a>

    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="返回首页">
          <span class="brand-mark" aria-hidden="true">拾</span>
          <span class="brand-copy">
            <strong>{{ site.title }}</strong>
            <small>Notes &amp; Ideas</small>
          </span>
        </a>

        <nav class="desktop-nav" aria-label="主导航">
          <a
            v-for="item in navItems"
            :key="item.link"
            class="nav-link"
            :class="{ active: isActive(item.link) }"
            :href="item.link"
          >
            {{ item.text }}
          </a>
        </nav>

        <div class="header-actions">
          <button class="icon-button theme-toggle" type="button" aria-label="切换明暗主题" @click="toggleTheme">
            <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 15.2A8.3 8.3 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
            </svg>
          </button>
          <button
            class="icon-button menu-toggle"
            type="button"
            :aria-expanded="menuOpen"
            aria-label="打开导航"
            @click="toggleMenu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav v-if="menuOpen" class="mobile-nav" aria-label="移动端导航">
        <a
          v-for="item in navItems"
          :key="item.link"
          :class="{ active: isActive(item.link) }"
          :href="item.link"
        >
          {{ item.text }}
          <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>

    <main id="main-content">
      <template v-if="isHome">
        <section class="home-hero">
          <div class="hero-glow hero-glow-one" />
          <div class="hero-glow hero-glow-two" />
          <div class="hero-copy">
            <p class="eyebrow"><span />{{ frontmatter.hero?.eyebrow }}</p>
            <h1>
              {{ frontmatter.hero?.name }}
              <em>{{ frontmatter.hero?.accent }}</em>
            </h1>
            <p class="hero-description">{{ frontmatter.hero?.tagline }}</p>
            <div class="hero-actions">
              <a
                v-for="action in frontmatter.hero?.actions"
                :key="action.link"
                :class="['hero-button', action.theme === 'alt' ? 'secondary' : 'primary']"
                :href="action.link"
              >
                {{ action.text }}
                <span aria-hidden="true">{{ action.theme === 'alt' ? '↗' : '→' }}</span>
              </a>
            </div>
            <div class="hero-meta">
              <span><i class="status-dot" />持续写作中</span>
              <span>{{ frontmatter.hero?.meta }}</span>
            </div>
          </div>

          <div class="hero-visual" aria-hidden="true">
            <div class="visual-grid" />
            <div class="orbit orbit-one"><i /></div>
            <div class="orbit orbit-two"><i /></div>
            <div class="visual-core">
              <span>THINK</span>
              <strong>写</strong>
              <small>CREATE</small>
            </div>
            <div class="floating-note note-one">灵感<br><b>01</b></div>
            <div class="floating-note note-two">探索<br><b>∞</b></div>
          </div>
        </section>

        <section class="home-section posts-section">
          <div class="section-heading">
            <div>
              <p class="section-kicker">RECENT NOTES</p>
              <h2>最近更新</h2>
            </div>
            <a href="/markdown-examples">查看全部 <span>→</span></a>
          </div>

          <div class="post-grid">
            <a
              v-for="(post, index) in frontmatter.posts"
              :key="post.link"
              class="post-card"
              :class="{ featured: index === 0 }"
              :href="post.link"
            >
              <div class="post-topline">
                <span>{{ post.category }}</span>
                <time>{{ post.date }}</time>
              </div>
              <div class="post-content">
                <p class="post-number">0{{ index + 1 }}</p>
                <h3>{{ post.title }}</h3>
                <p>{{ post.description }}</p>
              </div>
              <div class="post-footer">
                <span>阅读文章</span>
                <i aria-hidden="true">↗</i>
              </div>
            </a>
          </div>
        </section>

        <section class="home-section topic-section">
          <div class="topic-intro">
            <p class="section-kicker">WHAT I WRITE</p>
            <h2>把复杂的事，<br>写得简单一点。</h2>
            <p>记录技术实践，也收藏日常里值得反复回看的片刻。</p>
          </div>
          <div class="topic-list">
            <div v-for="(topic, index) in frontmatter.topics" :key="topic.title" class="topic-item">
              <span>0{{ index + 1 }}</span>
              <div>
                <h3>{{ topic.title }}</h3>
                <p>{{ topic.description }}</p>
              </div>
              <i>{{ topic.icon }}</i>
            </div>
          </div>
        </section>

        <Content class="home-content" />
      </template>

      <template v-else>
        <div class="article-layout">
          <aside class="article-sidebar" aria-label="文章导航">
            <div v-for="group in sidebarGroups" :key="group.text" class="sidebar-group">
              <p>{{ group.text }}</p>
              <a
                v-for="item in group.items"
                :key="item.link"
                :href="item.link"
                :class="{ active: isActive(item.link) }"
              >
                {{ item.text }}
              </a>
            </div>
          </aside>

          <article ref="article" class="article-main">
            <div class="article-meta">
              <span>{{ frontmatter.category || '随笔' }}</span>
              <time v-if="frontmatter.date">{{ frontmatter.date }}</time>
              <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }}</span>
            </div>
            <Content class="article-content vp-doc" />

            <nav v-if="previousPage || nextPage" class="page-nav" aria-label="文章翻页">
              <a v-if="previousPage" :href="previousPage.link" class="page-nav-item previous">
                <small>上一篇</small>
                <span>← {{ previousPage.text }}</span>
              </a>
              <a v-if="nextPage" :href="nextPage.link" class="page-nav-item next">
                <small>下一篇</small>
                <span>{{ nextPage.text }} →</span>
              </a>
            </nav>
          </article>

          <aside v-if="outline.length" class="article-outline" aria-label="本文目录">
            <p>本页目录</p>
            <a
              v-for="item in outline"
              :key="item.id"
              :class="[{ active: activeHeading === item.id }, `level-${item.level}`]"
              :href="`#${item.id}`"
            >
              {{ item.text }}
            </a>
          </aside>
        </div>
      </template>
    </main>

    <footer class="site-footer">
      <div>
        <a class="footer-brand" href="/">{{ site.title }}</a>
        <p>{{ site.description }}</p>
      </div>
      <p>© {{ new Date().getFullYear() }} · 用文字保存思考</p>
    </footer>
  </div>
</template>
