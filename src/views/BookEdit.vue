<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Book } from '@/types/book'
import BooksFacade from '@/services/BooksFacade'
import BookForm from '@/components/BookForm.vue'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'
import router from '@/router'

const props = defineProps<{
  id: string
}>()

const book = ref<Book | null>(null)

onMounted(async () => {
  book.value = await BooksFacade.getBook(props.id)
})
</script>

<template>
  <div class="p-4">
    <h1 class="flex flex-col border-b border-gray-200 pt-5 pb-6 mb-10">
      <template v-if="book">
        <span class="text-2xl font-bold">Edit Book</span>
        <span v-if="book.id" class="text-sm text-gray-500">{{ `Ref.: #${book.id}` }}</span>
      </template>
      <template v-else>
        <div class="h-7 w-48 rounded-md bg-gray-200 animate-pulse"></div>
        <div class="mt-2 h-4 w-32 rounded-md bg-gray-200 animate-pulse"></div>
      </template>
    </h1>
    <BookForm v-if="book" :book="book as Book" />

    <div v-else class="text-center py-16">
      <BookOpenIcon class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No results found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adding a new book</p>
      <div class="mt-6">
        <button
          type="button"
          @click="router.push('/books/new')"
          class="gap-1 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon class="size-5 shrink-0 text-white" />
          Add New Book
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
