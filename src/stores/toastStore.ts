import { defineStore } from 'pinia'

export interface ToastMessage {
  id: number
  type: 'success' | 'error'
  text: string
}

let idCounter = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
  }),

  actions: {
    addToast(type: ToastMessage['type'], text: string, duration = 3000) {
      const id = idCounter++
      this.messages.push({ id, type, text })

      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },

    success(text: string, duration?: number) {
      this.addToast('success', text, duration)
    },

    error(text: string, duration?: number) {
      this.addToast('error', text, duration)
    },

    removeToast(id: number) {
      this.messages = this.messages.filter((msg) => msg.id !== id)
    },
  },
})
