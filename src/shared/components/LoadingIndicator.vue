<script setup lang="ts">
defineProps<{
  size?: string;
  color?: string;
}>();
</script>

<template>
  <div class="d-flex justify-center my-4" data-testid="loading-indicator">
    <v-progress-circular indeterminate :size="size || 64" :color="color || 'primary'" />
  </div>
</template>
