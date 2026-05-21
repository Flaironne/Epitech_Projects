<template>
  <div id="layout" div :class="[{ 'dark-mode': darkMode }]">
   <router-view />
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from './store/themeStore'

const { darkMode } = useThemeStore();
</script>

<style>
html,
body {
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
}
</style>