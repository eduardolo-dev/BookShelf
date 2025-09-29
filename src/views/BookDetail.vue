<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'
import BooksFacade from '@/services/BooksFacade'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { useToastStore } from '@/stores/toastStore'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const toast = useToastStore()
const book = ref<Book | null>(null)
const showConfirmationModal = ref<boolean>(false)

async function deleteBook() {
  if (!book.value) return

  try {
    await BooksFacade.deleteBook(book.value.id)
    toast.success('Libro eliminado correctamente')
  } catch (err) {
    console.error('Error al eliminar el libro', err)
    toast.error('Error al eliminar el libro')
  } finally {
    showConfirmationModal.value = false
    router.back()
  }
}

onMounted(async () => {
  book.value = await BooksFacade.getBook(props.id)
})
</script>

<template>
  <div class="p-4">
    <div class="flex items-start justify-between border-b border-gray-200 pt-5 pb-6">
      <h1 class="flex flex-col">
        <template v-if="book">
          <span class="text-2xl font-bold text-gray-900">{{ book.title }}</span>
          <span v-if="book.id" class="text-sm text-gray-500">{{ `Ref.: #${book.id}` }}</span>
        </template>
        <template v-else>
          <div class="h-7 w-48 rounded-md bg-gray-200 animate-pulse"></div>
          <div class="mt-2 h-4 w-32 rounded-md bg-gray-200 animate-pulse"></div>
        </template>
      </h1>
      <div v-if="book" class="flex gap-3 flex-wrap-reverse">
        <button
          type="button"
          @click="showConfirmationModal = true"
          class="h-fit ml-auto block rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Delete
        </button>
        <button
          type="button"
          @click="router.push(`/books/${book.id}/edit`)"
          class="text-nowrap h-fit ml-auto block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Book
        </button>
      </div>
    </div>

    <div v-if="book" class="mt-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <dl class="divide-y divide-gray-200">
        <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Author</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ book.author }}</dd>
        </div>
        <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Published</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ book.published }}</dd>
        </div>
        <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Category</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ book.category }}</dd>
        </div>
        <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Stock</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ book.stock }}</dd>
        </div>
      </dl>
    </div>

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

  <ConfirmationModal
    :open="showConfirmationModal"
    title="Are you sure you want to delete this item?"
    confirmLabel="Yes, delete"
    cancelLabel="Cancel"
    @close="showConfirmationModal = false"
    @confirm="deleteBook"
  />
</template>
