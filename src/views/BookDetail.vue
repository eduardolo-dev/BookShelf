<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'
import BooksFacade from '@/services/BooksFacade'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { toast } from '@/utils/toast'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const book = ref<Book | null>(null)
const showConfirmationModal = ref<boolean>(false)

async function deleteBook() {
  if (!book.value) return

  try {
    await BooksFacade.deleteBook(book.value.id)
    toast.success('Libro eliminado correctamente')
  } catch (err) {
    console.error('Error al eliminar el libro', err)
    toast.error('Error al eliminar el libro')
  } finally {
    showConfirmationModal.value = false
    router.back()
  }
}

onMounted(async () => {
  book.value = await BooksFacade.getBook(Number(props.id))
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold py-5">{{ book?.title ?? 'Book Detail' }}</h1>
    <div v-if="book">
      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>Published:</strong> {{ book.published }}</p>
      <p><strong>Category:</strong> {{ book.category }}</p>
      <p><strong>Stock:</strong> {{ book.stock }}</p>
      <div class="flex gap-4 my-5">
        <button @click="router.push(`/books/${book.id}/edit`)">Edit</button>
        <button @click="showConfirmationModal = true">Delete</button>
      </div>
    </div>
    <div v-else>No se han encontrado resultados</div>
    <!-- TODO: cambiar texto -->
  </div>

  <ConfirmationModal
    :open="showConfirmationModal"
    title="Confirm deletion"
    confirmLabel="Yes, delete"
    cancelLabel="Cancel"
    @close="showConfirmationModal = false"
    @confirm="deleteBook"
  />
</template>

<style scoped></style>
