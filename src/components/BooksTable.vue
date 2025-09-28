<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import VueTable from './VueTable.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import { toast } from '@/utils/toast'
import BooksFacade from '@/services/BooksFacade'
import type { Book } from '../types/book'
import type { AxiosRequestConfig } from 'axios'
import { useDebouncedRef } from '@/utils/useDebouncedRef'

const router = useRouter()
const books = ref<Book[]>([])
const totalBooks = ref<number>(0)
const totalPages = ref<number>(0)
const showModal = ref<boolean>(false)
const bookToDelete = ref<Book | null>(null)
const page = ref<number>(1)
const limit = ref<number>(10)
const searchQuery = useDebouncedRef('', 1000)
const sort = ref<{ key: string; order: 'asc' | 'desc' | null } | null>(null)
const headers = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'author', label: 'Author' },
  { key: 'published', label: 'Published', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock', sortable: true },
]
const actions = [
  {
    label: 'Edit',
    class: 'text-indigo-600',
    onClick: (book: Book) => {
      router.push(`/books/${book.id}/edit`)
    },
  },
  {
    label: 'Delete',
    class: 'text-red-500',
    onClick: (book: Book) => {
      bookToDelete.value = book
      showModal.value = true
    },
  },
  {
    label: '➔',
    class: 'text-gray-400',
    onClick: (book: Book) => {
      router.push(`/books/${book.id}`)
    },
  },
]

onMounted(async () => {
  await getBooks()
})

async function getBooks() {
  const params: AxiosRequestConfig['params'] = {
    _page: page.value,
    _per_page: limit.value,
  }

  if (searchQuery.value !== '') {
    params.q = searchQuery.value
  }

  if (sort.value && sort.value.order) {
    params._sort = sort.value.key
    params._order = sort.value.order
  }

  const { data, pages, total } = await BooksFacade.getBooks(params)
  books.value = data
  totalPages.value = pages
  totalBooks.value = total
}

async function deleteBook() {
  if (!bookToDelete.value) return

  try {
    await BooksFacade.deleteBook(bookToDelete.value.id)
    toast.success('Libro eliminado correctamente')
  } catch (err) {
    console.error('Error al eliminar el libro', err)
    toast.error('Error al eliminar el libro')
  } finally {
    showModal.value = false
    bookToDelete.value = null
  }
}

async function handleSort(newSort: { key: string; order: 'asc' | 'desc' | null }) {
  sort.value = newSort
  await getBooks()
}

watch(searchQuery, () => {
  getBooks()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-64 rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 sm:text-sm outline-none focus:ring-0 focus:bg-gray-100"
      />

      <button
        type="button"
        @click="router.push('/books/new')"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add Book
      </button>
    </div>

    <VueTable
      :headers="headers"
      :items="books"
      :totalItems="totalBooks"
      :totalPages="totalPages"
      :actions="actions"
      :limit="limit"
      v-model:page="page"
      @update:page="getBooks"
      @update:sort="handleSort"
    />
  </div>

  <ConfirmationModal
    :open="showModal"
    title="Confirm deletion"
    confirmLabel="Yes, delete"
    cancelLabel="Cancel"
    @close="showModal = false"
    @confirm="deleteBook"
  />
</template>
