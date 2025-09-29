<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="msg in toastStore.messages"
          :key="msg.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4 flex items-start">
            <div class="flex-shrink-0">
              <CheckCircleIcon v-if="msg.type === 'success'" class="h-6 w-6 text-green-400" />
              <XCircleIcon v-else-if="msg.type === 'error'" class="h-6 w-6 text-red-400" />
            </div>

            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p
                class="text-sm font-medium"
                :class="msg.type === 'success' ? 'text-green-800' : 'text-red-800'"
              >
                {{ msg.text }}
              </p>
            </div>

            <div class="ml-4 flex flex-shrink-0">
              <button
                type="button"
                class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="toastStore.removeToast(msg.id)"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
