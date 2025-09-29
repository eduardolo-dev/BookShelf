<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import VueTable, { type Header, type TableAction } from './VueTable.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import { useToastStore } from '@/stores/toastStore'
import BooksFacade from '@/services/BooksFacade'
import type { Book } from '../types/book'
import type { AxiosRequestConfig } from 'axios'
import { useDebouncedRef } from '@/utils/useDebouncedRef'
import { FunnelIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const toast = useToastStore()

const books = ref<Book[]>([])
const totalBooks = ref<number>(0)
const showModal = ref<boolean>(false)
const bookToDelete = ref<Book | null>(null)
const page = ref<number>(1)
const limit = ref<number>(10)
const searchQuery = useDebouncedRef('', 1000)
const titleFilter = useDebouncedRef('', 500)
const authorFilter = useDebouncedRef('', 500)
const filtersOpen = ref<boolean>(false)
const sort = ref<{ key: string; order: 'asc' | 'desc' | null } | null>(null)
const headers: Header<Book>[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'author', label: 'Author' },
  { key: 'published', label: 'Published', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock', sortable: true },
]
const actions: TableAction<Book>[] = [
  {
    label: 'Edit',
    class:
      'text-sm font-semibold text-indigo-600 hover:text-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
    onClick: (book: Book) => router.push(`/books/${book.id}/edit`),
  },
  {
    label: 'Delete',
    class:
      'text-sm font-semibold text-red-600 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
    onClick: (book: Book) => {
      bookToDelete.value = book
      showModal.value = true
    },
  },
  {
    label: '➔',
    class: 'text-gray-400',
    onClick: (book: Book) => router.push(`/books/${book.id}`),
  },
]

onMounted(async () => {
  await getBooks()
})

async function getBooks() {
  const params: AxiosRequestConfig['params'] = {
    _page: page.value,
    _limit: limit.value,
  }

  if (searchQuery.value !== '') {
    params.q = searchQuery.value
  }

  if (titleFilter.value !== '') {
    params.title_like = titleFilter.value
  }

  if (authorFilter.value !== '') {
    params.author_like = authorFilter.value
  }

  if (sort.value && sort.value.order) {
    params._sort = sort.value.key
    params._order = sort.value.order
  }

  const { data, total } = await BooksFacade.getBooks(params)
  books.value = data
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
    getBooks()
  }
}

async function handleSort(newSort: { key: string; order: 'asc' | 'desc' | null }) {
  sort.value = newSort
  await getBooks()
}

watch([searchQuery, titleFilter, authorFilter], () => {
  getBooks()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      class="group flex items-center pl-4 font-medium text-gray-700"
      @click="filtersOpen = !filtersOpen"
    >
      <FunnelIcon
        class="mr-2 size-5 flex-none text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
      Filters
      <ChevronUpIcon
        v-if="filtersOpen"
        class="size-5 shrink-0 text-gray-400 mt-0.5"
        aria-hidden="true"
      />
      <ChevronDownIcon v-else class="size-5 shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
    </button>

    <div v-if="filtersOpen" class="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> Keyword </label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by keyword..."
          class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 sm:text-sm outline-none focus:ring-0 focus:bg-gray-100"
        />
      </div>
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="w-full">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> Title </label>
          <input
            v-model="titleFilter"
            type="text"
            placeholder="Search by title..."
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 sm:text-sm outline-none focus:ring-0 focus:bg-gray-100"
          />
        </div>
        <div class="w-full">
          <label for="author" class="block text-sm font-medium text-gray-700 mb-1"> Author </label>
          <input
            v-model="authorFilter"
            type="text"
            placeholder="Search author..."
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 sm:text-sm outline-none focus:ring-0 focus:bg-gray-100"
          />
        </div>
      </div>
    </div>

    <VueTable
      :headers="headers"
      :items="books"
      :totalItems="totalBooks"
      :actions="actions"
      :limit="limit"
      v-model:page="page"
      @update:page="getBooks"
      @update:sort="handleSort"
    />
  </div>

  <ConfirmationModal
    :open="showModal"
    title="Are you sure you want to delete this item?"
    confirmLabel="Yes, delete"
    cancelLabel="Cancel"
    @close="showModal = false"
    @confirm="deleteBook"
  />
</template>
