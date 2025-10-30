<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component, route }">
    <transition name="route-fade-slide" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </RouterView>
</template>

<style>
/* .app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
} */

.route-fade-slide-enter-active,
.route-fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.route-fade-slide-enter-from,
.route-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
