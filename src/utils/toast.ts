import { reactive } from 'vue'

export interface ToastMessage {
  id: number
  type: 'success' | 'error'
  text: string
}

const state = reactive({
  messages: [] as ToastMessage[],
})

let idCounter = 0

function addToast(type: ToastMessage['type'], text: string, duration = 3000) {
  const id = idCounter++
  state.messages.push({ id, type, text })

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id: number) {
  state.messages = state.messages.filter((msg) => msg.id !== id)
}

export const toast = {
  state,
  success(text: string, duration?: number) {
    addToast('success', text, duration)
  },
  error(text: string, duration?: number) {
    addToast('error', text, duration)
  },
  remove: removeToast,
}
