<script setup lang="ts">
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
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6 transform transition-all duration-300 ease-out"
      @click.stop
    >
      <div class="text-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ props.title || 'Are you sure you want to continue with this action?' }}
        </h2>

        <div class="flex justify-center space-x-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {{ props.cancelLabel || 'Close' }}
          </button>

          <button
            @click="emit('confirm')"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {{ props.confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
