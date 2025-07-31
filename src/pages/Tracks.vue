<script setup lang="ts">
import { useTrackStore } from '@/modules/track/store/trackStore';
import TrackSummary from '@/modules/track/components/TrackSummary.vue';
import TrackSearch from '@/modules/track/components/TrackSearch.vue';
import TrackFilters from '@/modules/track/components/TrackFilters.vue';
import TrackList from '@/modules/track/components/TrackList.vue';

const trackStore = useTrackStore();
trackStore.initializeStore();
</script>

<template>
  <div class="tracks-page">
    <div class="page-header mb-6 text-center">
      <h1 class="text-h5  md:text-h4 font-weight-bold mb-2">Music Collection</h1>
      <p class="text-body-1 text-grey-darken-1">Manage your music tracks</p>
    </div>

    <TrackSummary />

    <TrackSearch />

    <TrackFilters />

    <TrackList />
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
