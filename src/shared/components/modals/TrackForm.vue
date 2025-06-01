<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { useTracksStore } from '@/stores/tracks';
import { useModalsPool } from '@/stores/modalsPool';
import { useGenresStore } from '@/stores/genres';
import { type Track, type TrackFormData } from '@/services/tracks';

const props = withDefaults(
  defineProps<{
    track?: Track | null;
  }>(),
  {
    track: null,
  }
);

const visibleStore = useModalsPool();
const tracksStore = useTracksStore();
const notificationStore = useNotificationStore();
const genresStore = useGenresStore();

const showDialog = ref<boolean>(true);
const loading = ref<boolean>(false);
const form = ref<TrackFormData>({
  title: props.track?.title || '',
  artist: props.track?.artist || '',
  album: props.track?.album || '',
  genres: props.track?.genres || [],
});
const formRef = ref<HTMLFormElement | null>(null);
const formValid = ref<boolean>(false);

const isEditMode: ComputedRef<boolean> = computed(() => !!props.track);

const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  const { valid } = await formRef.value.validate();
  formValid.value = valid;
  return valid;
};

const submitForm = async (): Promise<void> => {
  const isValid = await validateForm();
  if (!isValid) {
    notificationStore.notify('Please correct the form errors', 'error');
    return;
  }

  try {
    loading.value = true;

    if (isEditMode.value && props.track) {
      await tracksStore.updateTrack(props.track.id, form.value);
      notificationStore.notify('Track updated successfully', 'success');
    } else {
      await tracksStore.createTrack(form.value);
      notificationStore.notify('Track created successfully', 'success');
    }

    closeDialog();
  } catch (error) {
    console.error('Error saving track:', error);
    notificationStore.notify('Failed to save track', 'error');
  } finally {
    loading.value = false;
  }
};

const closeDialog = (): void => {
  visibleStore.removeVisibleItem('TrackForm');
};
</script>

<template>
  <v-dialog v-model="showDialog" maxWidth="600px">
    <v-card data-testid="track-form-dialog">
      <v-card-title>
        <span class="text-h6">{{ isEditMode ? 'Edit Track' : 'Create Track' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          v-model="formValid"
          data-testid="track-form"
          lazyValidation
          @submit.prevent="submitForm"
        >
          <v-text-field
            v-model="form.title"
            label="Title"
            required
            :rules="[v => !!v || 'Title is required']"
            data-testid="input-title"
          />
          <div v-if="!form.title" data-testid="error-title" class="text-error text-caption">
            Title is required
          </div>

          <v-text-field
            v-model="form.artist"
            label="Artist"
            required
            :rules="[v => !!v || 'Artist is required']"
            data-testid="input-artist"
          />
          <div v-if="!form.artist" data-testid="error-artist" class="text-error text-caption">
            Artist is required
          </div>

          <v-text-field v-model="form.album" label="Album" data-testid="input-album" />

          <v-text-field
            v-model="form.coverImage"
            label="Cover Image URL"
            data-testid="input-cover-image"
            :rules="[
              v =>
                !v ||
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(v) ||
                'Please enter a valid URL',
            ]"
          />

          <v-combobox
            v-model="form.genres"
            :items="genresStore.genres"
            label="Genres"
            multiple
            chips
            closableChips
            data-testid="genre-selector"
          />
          <div v-if="!form.genres.length" data-testid="error-genre" class="text-error text-caption">
            At least one genre is recommended
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" data-testid="cancel-form" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          data-testid="submit-button"
          :loading="loading"
          :disabled="!formValid || loading"
          @click="submitForm"
        >
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
