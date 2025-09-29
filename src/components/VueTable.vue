<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, computed } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'

export interface Header<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
}

export interface TableAction<T> {
  label: string
  class: string
  onClick: (item: T) => void
}

const props = withDefaults(
  defineProps<{
    headers: Header<T>[]
    items: T[]
    totalItems: number
    actions?: TableAction<T>[]
    page?: number
    limit?: number
  }>(),
  {
    page: 1,
    limit: 10,
  },
)

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:sort', payload: { key: keyof T & string; order: 'asc' | 'desc' | null }): void
}>()

const sortKey = ref<(keyof T & string) | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)

const totalPages = computed(() => Math.ceil(props.totalItems / props.limit))

function toggleSort(header: Header<T>) {
  if (!header.sortable) return

  if (sortKey.value !== header.key) {
    sortKey.value = header.key
    sortOrder.value = 'asc'
  } else {
    if (sortOrder.value === 'asc') sortOrder.value = 'desc'
    else if (sortOrder.value === 'desc') sortOrder.value = null
    else sortOrder.value = 'asc'
  }

  if (sortKey.value) {
    emit('update:sort', { key: sortKey.value, order: sortOrder.value })
  }
}

function goPrev() {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}

function goNext() {
  if (props.page < totalPages.value) {
    emit('update:page', props.page + 1)
  }
}
</script>

<template>
  <div class="overflow-x-auto overflow-hidden rounded-lg border border-gray-200">
    <table class="min-w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="p-4 text-left select-none"
            :class="{ 'hover:bg-gray-100 cursor-pointer': header.sortable }"
            @click="toggleSort(header)"
          >
            <div class="flex justify-items-center gap-2">
              <span>{{ header.label }}</span>
              <span
                v-if="header.sortable"
                class="my-auto w-5 h-5 bg-gray-200 rounded-sm border border-gray-200 mt-0.5 relative"
              >
                <ChevronUpIcon
                  v-if="sortOrder === 'asc' && sortKey === header.key"
                  class="size-5 shrink-0 text-gray-400 absolute left-[-1px]"
                  aria-hidden="true"
                />
                <ChevronDownIcon
                  v-else-if="sortOrder === 'desc' && sortKey === header.key"
                  class="size-5 shrink-0 text-gray-400 absolute left-[-1px]"
                  aria-hidden="true"
                />
                <span v-else class="text-gray-400 absolute -top-1 left-1.5">-</span>
              </span>
            </div>
          </th>
          <th v-if="actions?.length" class="px-4 py-2 text-left"></th>
        </tr>
      </thead>
      <tbody v-if="props.items.length">
        <tr
          v-for="(item, index) in items"
          :key="index"
          class="hover:bg-gray-50 border-b border-gray-200"
        >
          <td v-for="header in headers" :key="String(header.key)" class="px-4 py-2">
            {{ item[header.key] }}
          </td>
          <td v-if="actions?.length" class="p-3 flex gap-2">
            <button
              v-for="(action, i) in actions"
              :key="i"
              :class="['p-2', action.class]"
              @click="action.onClick(item)"
            >
              {{ action.label }}
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="headers.length + (actions?.length ? 1 : 0)" class="px-6 py-10 text-center">
            <div class="flex flex-col items-center justify-center">
              <PlusCircleIcon class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <h3 class="mt-2 text-sm font-semibold text-gray-900">No items found</h3>
              <p class="mt-1 text-sm text-gray-500">Start by adding a new record to see it here.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <nav
      class="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ (page - 1) * limit + 1 }}</span>
          to
          <span class="font-medium">{{ Math.min(page * limit, totalItems) }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div class="flex flex-1 justify-between sm:justify-end">
        <button
          @click="goPrev"
          :disabled="props.page === 1"
          class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:!cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="goNext"
          :disabled="props.page === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:!cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>
  </div>
</template>
