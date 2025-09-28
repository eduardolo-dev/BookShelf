<script setup lang="ts">
import { toast } from '@/utils/toast'
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="msg in toast.state.messages"
      :key="msg.id"
      :class="[
        'px-4 py-2 rounded-lg shadow-md text-white animate-fade-in-down cursor-pointer',
        msg.type === 'success' && 'bg-green-500',
        msg.type === 'error' && 'bg-red-500',
      ]"
      @click="toast.remove(msg.id)"
    >
      {{ msg.text }}
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out;
}
</style>
