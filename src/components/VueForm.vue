<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Constraint } from '@/constraints/Constraint'
import ConfirmationModal from './ConfirmationModal.vue'

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
  (e: 'submit', values: Record<string, unknown>): void
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

    <div class="flex flex-col lg:flex-row gap-3 pt-4">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Saving...' : submitLabel }}
      </button>
      <button
        type="button"
        @click="handleCancel"
        class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
      >
        Cancel
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
