<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  // ChevronLeftIcon,
  // ChevronRightIcon,
} from '@heroicons/vue/20/solid'

export interface Header {
  key: string
  label: string
  sortable?: boolean
}

export interface TableAction {
  label: string
  class: string
  onClick: (item: Record<string, unknown>) => void
}

const props = withDefaults(
  defineProps<{
    headers: Header[]
    items: Record<string, unknown>[]
    totalItems: number
    totalPages: number
    actions?: TableAction[]
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
  (e: 'update:sort', payload: { key: string; order: 'asc' | 'desc' | null }): void
}>()

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)

function toggleSort(header: Header) {
  if (!header.sortable) return

  if (sortKey.value !== header.key) {
    sortKey.value = header.key
    sortOrder.value = 'asc'
  } else {
    if (sortOrder.value === 'asc') sortOrder.value = 'desc'
    else if (sortOrder.value === 'desc') sortOrder.value = null
    else sortOrder.value = 'asc'
  }

  emit('update:sort', { key: sortKey.value!, order: sortOrder.value })
}

function goPrev() {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}

function goNext() {
  if (props.page < props.totalPages) {
    emit('update:page', props.page + 1)
  }
}

// function onInputPage(e: Event) {
//   const value = Number((e.target as HTMLInputElement).value)
//   if (!isNaN(value) && value > 0) {
//     emit('update:page', value)
//   }
// }
</script>

<template>
  <div class="overflow-x-auto overflow-hidden rounded-lg border border-gray-300">
    <table class="min-w-full">
      <thead class="bg-gray-50 border-b border-gray-300">
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
              <span v-if="header.sortable" class="w-3">
                <ChevronUpIcon
                  v-if="sortOrder === 'asc' && sortKey === header.key"
                  class="size-5 shrink-0 text-gray-400 mt-0.5"
                  aria-hidden="true"
                />
                <ChevronDownIcon
                  v-else-if="sortOrder === 'desc' && sortKey === header.key"
                  class="size-5 shrink-0 text-gray-400 mt-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </th>
          <th v-if="actions?.length" class="px-4 py-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          class="hover:bg-gray-50 border-b border-gray-300"
        >
          <td v-for="header in headers" :key="String(header.key)" class="px-4 py-2">
            {{ item[header.key] }}
          </td>
          <td v-if="actions?.length" class="p-3 flex gap-2">
            <button
              v-for="(action, i) in actions"
              :key="i"
              :class="['p-2 text-sm', action.class]"
              @click="action.onClick(item)"
            >
              {{ action.label }}
            </button>
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
          :disabled="props.page === props.totalPages"
          class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:!cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>

    <!-- <div class="flex items-center justify-end gap-2 p-2 bg-gray-50">
      <button class="p-2" :disabled="props.page <= 1" @click="goPrev">
        <ChevronLeftIcon class="size-5 shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
      </button>
      <input
        type="number"
        class="w-14 text-center rounded-md border border-gray-300 px-2 py-2 text-gray-900 placeholder:text-gray-500 sm:text-sm outline-none focus:ring-0 focus:bg-gray-50 no-spinner"
        min="0"
        :value="props.page"
        @input="onInputPage"
      />
      <button class="p-2" @click="goNext">
        <ChevronRightIcon class="size-5 shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
      </button>
    </div> -->
  </div>
</template>
