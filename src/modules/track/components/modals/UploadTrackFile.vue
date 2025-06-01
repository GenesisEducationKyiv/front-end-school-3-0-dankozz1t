<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useNotificationStore } from '@/shared/modules/notification/store/notification';
import { useTrackStore } from '@/modules/track/store/trackStore';
import { useModalsPool } from '@/shared/modules/modalsPool/store/modalsPool';
import { type Track } from '@/modules/track/types';

const props = defineProps<{
  track: Track;
}>();

const modalsStore = useModalsPool();
const trackStore = useTrackStore();
const notificationStore = useNotificationStore();

const showDialog = ref<boolean>(true);
const loading = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const formRef = ref<HTMLFormElement | null>(null);
const formValid = ref<boolean>(false);

const handleFileChange = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  if (selectedFile.value instanceof File) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  const { valid } = await formRef.value.validate();
  formValid.value = valid;
  return valid;
};

const submitUpload = async (): Promise<void> => {
  const isValid = await validateForm();
  if (!isValid || !selectedFile.value) {
    notificationStore.notify('Please select a valid file to upload', 'warning');
    return;
  }

  try {
    loading.value = true;
    await trackStore.uploadTrackFile(props.track.id, selectedFile.value);
    notificationStore.notify('File uploaded successfully', 'success');
    closeDialog();
  } catch (error) {
    console.error('Error uploading file:', error);
    notificationStore.notify('Failed to upload file', 'error');
  } finally {
    loading.value = false;
  }
};

const closeDialog = (): void => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  modalsStore.removeVisibleItem('UploadTrackFile');
};

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <v-dialog v-model="showDialog" maxWidth="500px">
    <v-card data-testid="upload-file-dialog">
      <v-card-title>
        <span class="text-h6">Upload Audio File</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="formValid" lazyValidation>
          <v-file-input
            v-model="selectedFile"
            label="Audio File"
            accept="audio/*"
            prependIcon="mdi-music"
            :loading="loading"
            data-testid="file-input"
            :rules="[
              v => !!v || 'File is required',
              v => !v || v.size < 10000000 || 'File size should be less than 10MB',
            ]"
            @update:modelValue="handleFileChange"
          />
          <div v-if="!selectedFile" data-testid="error-file" class="text-error text-caption">
            Please select a file
          </div>

          <div v-if="props.track.audioFile" class="mt-2">
            <p class="text-body-2">Current file: {{ props.track.audioFile.split('/').pop() }}</p>
            <p class="text-caption">Uploading a new file will replace the current one</p>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" data-testid="cancel-upload" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          data-testid="submit-upload"
          :loading="loading"
          :disabled="!formValid || !selectedFile"
          @click="submitUpload"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
