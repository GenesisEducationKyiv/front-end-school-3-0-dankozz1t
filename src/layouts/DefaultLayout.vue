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
      <div class="d-flex w-100 align-center">
        <GlobalAudioPlayer class="w-100" />
      </div>

      <div class="text-center" cols="12">
        &#169; {{ new Date().getFullYear() }} — <strong>Alex Taylor Danko</strong>
      </div>
    </v-footer>
  </v-app>
</template>
