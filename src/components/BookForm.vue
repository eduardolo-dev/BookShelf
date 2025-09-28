<script setup lang="ts">
import { ref, watch } from 'vue'
import VueForm, { type Field } from '@/components/VueForm.vue'
import { toast } from '@/utils/toast'
import { NotBlank } from '@/constraints/NotBlank'
import { MinLength } from '@/constraints/MinLenght'
import { MaxDate } from '@/constraints/MaxDate'
import type { Book, CreateBook, UpdateBook } from '@/types/book'
import BooksFacade from '@/services/BooksFacade'

const props = defineProps<{
  book?: Book
}>()

const formData = ref({
  title: { value: '', rules: [new NotBlank(), new MinLength(3)], errors: [] } as Field<string>,
  author: { value: '', rules: [new NotBlank(), new MinLength(3)], errors: [] } as Field<string>,
  published: { value: '', rules: [new MaxDate(new Date())], errors: [] } as Field<string>,
  category: { value: '', rules: [new NotBlank(), new MinLength(3)], errors: [] } as Field<string>,
  stock: { value: 0, rules: [], errors: [] } as Field<number>,
})

watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      formData.value.title.value = newBook.title
      formData.value.author.value = newBook.author
      formData.value.published.value = newBook.published
      formData.value.category.value = newBook.category
      formData.value.stock.value = newBook.stock
    }
  },
  { immediate: true },
)

const isLoading = ref(false)

const handleSubmit = async (values: Record<string, unknown>) => {
  isLoading.value = true
  try {
    if (props.book?.id) {
      await BooksFacade.editBook(props.book.id, values as UpdateBook)
      toast.success('Libro editado correctamente')
    } else {
      await BooksFacade.createBook(values as CreateBook)
      toast.success('Libro creado correctamente')
    }
  } catch (error) {
    console.error('Error al guardar el libro:', error)
    toast.error('La accion no se pudo realizar correctamente')
  } finally {
    isLoading.value = false
  }
}

const resetInputs = () => {
  formData.value.title.value = ''
  formData.value.author.value = ''
  formData.value.published.value = ''
  formData.value.category.value = ''
  formData.value.stock.value = 0

  for (const field of Object.values(formData.value)) {
    field.errors = []
  }
}
</script>

<template>
  <VueForm
    :form-data="formData"
    :loading="isLoading"
    submitLabel="Save"
    @submit="handleSubmit"
    @cancel="resetInputs"
  >
    <template v-slot:default="{ form }">
      <!-- TODO: Que es esto? -->
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="w-full">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> Title * </label>
          <input
            id="title"
            v-model="form.title.value"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ingresa el título del libro"
          />
          <span class="text-red-500 text-xs" v-if="form.title.errors">
            {{ form.title.errors[0] }}
          </span>
        </div>

        <div class="w-full">
          <label for="author" class="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            id="author"
            v-model="form.author.value"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ingresa el nombre del autor"
          />
          <span class="text-red-500 text-xs" v-if="form.title.errors">
            {{ form.author.errors[0] }}
          </span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-4">
        <div class="w-full">
          <label for="published" class="block text-sm font-medium text-gray-700 mb-1">
            Published *
          </label>
          <input
            id="published"
            v-model="form.published.value"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 2023"
          />
          <span class="text-red-500 text-xs" v-if="form.title.errors">
            {{ form.published.errors[0] }}
          </span>
        </div>

        <div class="w-full">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            id="category"
            v-model="form.category.value"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Ficción, Ciencia, Historia"
          />
          <span class="text-red-500 text-xs" v-if="form.title.errors">
            {{ form.category.errors[0] }}
          </span>
        </div>
      </div>

      <div class="lg:max-w-[calc(50%-8px)]">
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-1"> Stock </label>
        <input
          id="stock"
          v-model.number="form.stock.value"
          type="number"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="0"
        />
        <span class="text-red-500 text-xs" v-if="form.title.errors">
          {{ form.stock.errors[0] }}
        </span>
      </div>
    </template>
  </VueForm>
</template>
