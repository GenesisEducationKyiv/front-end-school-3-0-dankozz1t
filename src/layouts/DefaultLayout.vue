<script setup lang="ts">
import GlobalAudioPlayer from '@/components/Tracks/GlobalAudioPlayer.vue';
</script>

<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Music Manager</v-toolbar-title>
    <v-spacer />
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>

  <v-footer app class="d-flex flex-column" color="primary" dark>
    <div class="d-flex w-100 align-center px-4 py-2">
      <GlobalAudioPlayer />
    </div>

    <div class="text-center" cols="12">
      &#169; {{ new Date().getFullYear() }} — <strong>Alex Taylor Danko</strong>
    </div>
  </v-footer>
</template>
