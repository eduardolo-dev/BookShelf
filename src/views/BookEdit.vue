<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Book } from '@/types/book'
import BooksFacade from '@/services/BooksFacade'
import BookForm from '@/components/BookForm.vue'

const props = defineProps<{
  id: string
}>()

const book = ref<Book | null>(null)

onMounted(async () => {
  book.value = await BooksFacade.getBook(Number(props.id))
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold py-5">Edit Book</h1>
    <BookForm v-if="book" :book="book as Book" />
    <div v-else>No se han encontrado resultados</div>
  </div>
</template>

<style scoped></style>
