<script setup lang="ts">
import TrackListGraphQL from '@/modules/track/components/TrackListGraphQL.vue';
</script>

<template>
  <div class="tracks-page">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Music Collection (GraphQL)</h1>
      <p class="text-body-1 text-grey-darken-1">Manage your music tracks with GraphQL</p>
    </div>

    <TrackListGraphQL />
  </div>
</template>

<style scoped>
.tracks-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
}

@media (max-width: 600px) {
  .page-header {
    text-align: left;
  }
}
</style>
