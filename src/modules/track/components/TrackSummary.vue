<script setup lang="ts">
import { computed } from 'vue';
import { useTrackStore } from '../store/trackStore';

const trackStore = useTrackStore();

const trackStats = computed(() => {
  const tracks = trackStore.tracks;
  const totalTracks = trackStore.totalTracks;
  const currentPage = trackStore.currentPage;
  const itemsPerPage = trackStore.itemsPerPage;

  // Calculate pagination info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalTracks);

  // Calculate unique artists and albums from current page
  const uniqueArtists = new Set(tracks.map(track => track.artist)).size;
  const uniqueAlbums = new Set(tracks.map(track => track.album).filter(Boolean)).size;

  // Calculate genre distribution from current page
  const genreCount: Record<string, number> = {};
  tracks.forEach(track => {
    track.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre, count]) => ({ genre, count }));

  return {
    totalTracks,
    displayedTracks: tracks.length,
    uniqueArtists,
    uniqueAlbums,
    topGenres,
    hasFilters: trackStore.searchQuery || trackStore.selectedGenre || trackStore.selectedArtist,
    paginationText:
      totalTracks > 0
        ? `Showing ${startItem}-${endItem} of ${totalTracks} tracks`
        : 'No tracks found',
    currentPage,
    itemsPerPage,
  };
});
</script>

<template>
  <v-card class="mb-4" elevation="1">
    <v-card-text class="pb-2">
      <v-row>
        <v-col cols="12" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-primary">
              {{ trackStats.totalTracks }}
            </div>
            <div class="text-caption text-grey">Total Tracks</div>
            <div class="text-caption text-info">
              {{ trackStats.paginationText }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-success">
              {{ trackStats.uniqueArtists }}
            </div>
            <div class="text-caption text-grey">Artists (on page)</div>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-info">
              {{ trackStats.uniqueAlbums }}
            </div>
            <div class="text-caption text-grey">Albums (on page)</div>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="text-center">
            <div class="text-subtitle-2 font-weight-bold mb-1">Top Genres</div>
            <div v-if="trackStats.topGenres.length > 0">
              <v-chip
                v-for="{ genre, count } in trackStats.topGenres"
                :key="genre"
                size="x-small"
                class="ma-1"
                color="secondary"
              >
                {{ genre }} ({{ count }})
              </v-chip>
            </div>
            <div v-else class="text-caption text-grey">No genres</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
