<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, nextTick } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  open: boolean
  title?: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const cancelButtonRef = ref<HTMLButtonElement | null>(null)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      cancelButtonRef.value?.focus()
    }
  },
)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-gray-500/75" @click="emit('close')"></div>

    <div
      class="relative z-10 w-full max-w-md transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left transition-all sm:p-6"
    >
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <ExclamationTriangleIcon class="h-6 w-6 text-yellow-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ props.title || 'Are you sure you want to continue with this action?' }}
          </h3>
        </div>
      </div>

      <div class="mt-5 sm:mt-6 sm:flex sm:flex-row gap-3">
        <button
          ref="cancelButtonRef"
          type="button"
          class="mt-3 ml-auto inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
          @click="emit('close')"
        >
          {{ props.cancelLabel || 'Cancel' }}
        </button>
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 sm:ml-3 sm:w-auto"
          @click="emit('confirm')"
        >
          {{ props.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>
