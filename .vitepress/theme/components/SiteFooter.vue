<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex min-h-28 max-w-[70rem] items-center justify-between gap-6 px-6 text-sm text-subtle sm:px-8">
      <p class="m-0">© {{ new Date().getFullYear() }} {{ title }}</p>
      <nav class="flex gap-5" aria-label="页脚导航">
        <a class="transition-colors hover:text-ink" href="/articles">文章</a>
      </nav>
    </div>
  </footer>
</template>
