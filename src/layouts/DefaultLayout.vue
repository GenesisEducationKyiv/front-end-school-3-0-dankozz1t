<script setup lang="ts">
import GlobalAudioPlayer from '@/modules/player/components/GlobalAudioPlayer.vue';
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Music Manager</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app class="d-flex flex-column" color="primary" dark>
      <v-container class="pa-0">
        <GlobalAudioPlayer class="w-100" />
      </v-container>

      <div class="text-center mt-2" cols="12">
        &#169; {{ new Date().getFullYear() }} — <strong>Alex Taylor Danko</strong>
      </div>
    </v-footer>
  </v-app>
</template>
