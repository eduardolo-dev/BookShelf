<script setup lang="ts">
import BooksTable from '@/components/BooksTable.vue'
import { useRouter } from 'vue-router'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
</script>

<template>
  <div class="p-4">
    <div class="flex items-start justify-between border-b border-gray-200 pt-5 pb-6 mb-10">
      <h1 class="text-2xl font-bold">Books</h1>
      <button
        type="button"
        @click="router.push('/books/new')"
        class="flex gap-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusCircleIcon class="size-5 shrink-0 text-white" />
        <span>New Book</span>
      </button>
    </div>

    <BooksTable />
  </div>
</template>

<style scoped></style>
