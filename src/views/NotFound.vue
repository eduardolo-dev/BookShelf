<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 class="text-6xl font-bold text-indigo-600 mb-4">404</h1>
    <p class="text-xl text-gray-700 mb-6">Page not found</p>
    <router-link
      to="/books"
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
    >
      Back to Books
    </router-link>
  </div>
</template>

<style scoped></style>
