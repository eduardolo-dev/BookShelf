<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Constraint } from '@/constraints/Constraint'
import ConfirmationModal from './ConfirmationModal.vue'
import type { Book } from '@/types/book'

export interface Field<T> {
  value: T
  rules: Constraint[]
  errors: string[]
}

export interface FormData {
  [key: string]: Field<unknown>
}

const props = withDefaults(
  defineProps<{
    formData: FormData
    loading?: boolean
    submitLabel?: string
    needsConfirmation?: boolean
  }>(),
  {
    loading: false,
    submitLabel: 'Submit',
    needsConfirmation: true,
  },
)

const emit = defineEmits<{
  (e: 'submit', values: Record<string, Book | unknown>): void
  (e: 'cancel'): void
}>()

const form = reactive(props.formData)
const showModal = ref<boolean>(false)

function validateForm(): boolean {
  let isValid = true

  for (const key in form) {
    const field = form[key]
    field.errors = []

    for (const rule of field.rules) {
      const result = rule.validate(field.value)
      if (result !== true) {
        field.errors.push(rule.message)
        isValid = false
      }
    }
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return

  if (props.needsConfirmation) {
    showModal.value = true
    return
  }

  submit()
}

function handleCancel() {
  emit('cancel')
}

function confirmSubmit() {
  showModal.value = false
  submit()
}

function submit() {
  const values: Record<string, unknown> = {}
  for (const key in form) {
    values[key] = form[key].value
  }

  emit('submit', values)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <slot :form="form" />

    <div class="flex gap-5 pt-4 justify-end">
      <button
        type="button"
        @click="handleCancel"
        class="text-sm/6 font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Saving...' : submitLabel }}
      </button>
    </div>
  </form>

  <ConfirmationModal
    :open="showModal"
    title="Confirm submission"
    confirmLabel="Yes, submit"
    cancelLabel="Cancel"
    @close="showModal = false"
    @confirm="confirmSubmit"
  />
</template>
