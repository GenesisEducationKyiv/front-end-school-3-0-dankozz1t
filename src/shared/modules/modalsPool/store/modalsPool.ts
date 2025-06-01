import { defineStore } from 'pinia';
import {
  computed,
  defineAsyncComponent,
  ref,
  shallowRef,
  watch,
  type Component,
  type ShallowRef,
} from 'vue';

export type ModalName = 'DeleteTrack' | 'TrackForm' | 'UploadTrackFile';

export interface ModalData {
  [key: string]: unknown;
}

export interface ModalItem {
  name: ModalName;
  component: ShallowRef<Component>;
  data?: ModalData;
}

const initialList: readonly ModalItem[] = [
  {
    name: 'DeleteTrack',
    component: shallowRef(
      defineAsyncComponent(() => import('@/modules/track/components/modals/DeleteTrack.vue'))
    ),
  },
  {
    name: 'TrackForm',
    component: shallowRef(
      defineAsyncComponent(() => import('@/modules/track/components/modals/TrackForm.vue'))
    ),
  },
  {
    name: 'UploadTrackFile',
    component: shallowRef(
      defineAsyncComponent(() => import('@/modules/track/components/modals/UploadTrackFile.vue'))
    ),
  },
] as const;

export const useModalsPool = defineStore('modals-pool', () => {
  const modalsPool = ref<ModalItem[]>([]);

  const isItemInPool = computed(() => {
    return (name: ModalName): boolean => {
      return !!modalsPool.value?.find(item => item.name === name);
    };
  });

  const addVisibleItem = async (name: ModalName, data?: ModalData): Promise<void> => {
    const itemByName = initialList?.find(item => {
      return item.name === name;
    });

    if (!itemByName) {
      console.warn(`Modal with name "${name}" not found in initialList`);
      return;
    }

    const modalItem: ModalItem = {
      ...itemByName,
      data: data || {},
    };

    modalsPool.value?.push(modalItem);
  };

  const removeVisibleItem = (name: ModalName): void => {
    modalsPool.value = modalsPool.value?.filter(item => {
      return item.name !== name;
    });
  };

  watch(
    () => modalsPool.value.length,
    (val: number): void => {
      document.body.classList.toggle('--no-scroll', val > 0);
    }
  );

  return {
    modalsPool,
    isItemInPool,
    addVisibleItem,
    removeVisibleItem,
  };
});
