<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue';
import { useNotificationStore } from '@/shared/modules/notification/store/notification';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import { type Track } from '@/modules/track/types';

interface DeleteTrackProps {
  track?: Track;
  trackIds?: string[];
}

const props = defineProps<DeleteTrackProps>();

const modalsStore = useModalsPool();

const trackStore = useTrackStore();
const notificationStore = useNotificationStore();

const showDialog = ref<boolean>(true);
const loading = ref<boolean>(false);

const isBulkDelete: ComputedRef<boolean> = computed(() => Boolean(props.trackIds?.length));

const confirmDelete = async (): Promise<void> => {
  try {
    loading.value = true;

    if (isBulkDelete.value && props.trackIds) {
      await trackStore.deleteTracks(props.trackIds);
      notificationStore.notify(`Successfully deleted ${props.trackIds.length} tracks`, 'success');
    } else if (props.track) {
      await trackStore.deleteTrack(props.track.id);
      notificationStore.notify('Track deleted successfully', 'success');
    }

    closeDialog();
  } catch (error) {
    console.error('Error deleting track(s):', error);
    notificationStore.notify('Failed to delete track(s)', 'error');
  } finally {
    loading.value = false;
  }
};

const closeDialog = (): void => {
  modalsStore.removeVisibleItem('DeleteTrack');
};
</script>

<template>
  <v-dialog v-model="showDialog" maxWidth="400px">
    <v-card data-testid="confirm-dialog">
      <v-card-title>
        <span class="text-h6">Delete Track</span>
      </v-card-title>

      <v-card-text>
        <p v-if="!isBulkDelete">
          Are you sure you want to delete "<strong>{{ track?.title }}</strong
          >" by {{ track?.artist }}?
        </p>
        <p v-else>
          Are you sure you want to delete <strong>{{ trackIds?.length }}</strong> selected tracks?
        </p>
        <p class="text-caption text-red mt-2">This action cannot be undone.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" data-testid="cancel-delete" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn color="error" data-testid="confirm-delete" :loading="loading" @click="confirmDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
