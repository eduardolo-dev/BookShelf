<script setup lang="ts">
import BreadCrumbs from './components/BreadCrumbs.vue'
import VueToast from './components/VueToast.vue'
</script>

<template>
  <div class="container mx-auto py-7">
    <BreadCrumbs class="px-4" />
    <router-view />
    <VueToast />
  </div>
</template>

<style scoped></style>
