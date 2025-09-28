<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/20/solid'

const route = useRoute()

const pages = computed(() =>
  route.matched
    .filter((route) => route.path !== '/')
    .map((route, idx, arr) => ({
      name: String(route.meta?.breadcrumb ?? route.name ?? route.path),
      href: route.path,
      current: idx === arr.length - 1,
    })),
)
</script>
<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4">
      <li>
        <div>
          <RouterLink to="/books" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="size-5 shrink-0" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </RouterLink>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name">
        <div class="flex items-center">
          <ChevronRightIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
          <RouterLink
            :to="page.href"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            :aria-current="page.current ? 'page' : undefined"
          >
            {{ page.name }}
          </RouterLink>
        </div>
      </li>
    </ol>
  </nav>
</template>
