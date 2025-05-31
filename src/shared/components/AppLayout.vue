<script setup lang="ts">
import { computed } from 'vue';
import { usePlayerStore } from '@/modules/player/store/playerStore';
import GlobalAudioPlayer from '@/modules/player/components/GlobalAudioPlayer.vue';

const playerStore = usePlayerStore();

const hasPlayerVisible = computed(() => playerStore.hasAudioLoaded);
</script>

<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-4">
        <slot />
      </v-container>
    </v-main>

    <!-- Global Audio Player (fixed at bottom when active) -->
    <Teleport to="body">
      <div v-if="hasPlayerVisible" class="global-player-container">
        <GlobalAudioPlayer />
      </div>
    </Teleport>
  </v-app>
</template>

<style scoped>
.global-player-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Add bottom padding to main content when player is active */
.v-main {
  padding-bottom: 0;
  transition: padding-bottom 0.3s ease;
}

.v-main.has-player {
  padding-bottom: 120px;
}
</style>
