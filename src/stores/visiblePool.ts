import { defineStore } from 'pinia';
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue';

const initialList: any[] = [
  {
    name: 'DeleteTrack',
    component: shallowRef(
      defineAsyncComponent(() => import('@/components/Modals/DeleteTrack.vue'))
    ),
  },
  {
    name: 'TrackForm',
    component: shallowRef(defineAsyncComponent(() => import('@/components/Modals/TrackForm.vue'))),
  },
  {
    name: 'UploadTrackFile',
    component: shallowRef(
      defineAsyncComponent(() => import('@/components/Modals/UploadTrackFile.vue'))
    ),
  },
];

export const useVisiblePool = defineStore('visibility-store', () => {
  const visiblePool = ref<any[]>([]);

  const isItemInPool = computed(() => {
    return (name: any) => {
      return !!visiblePool.value?.find(item => item.name === name);
    };
  });

  const addVisibleItem = async <T>(name: T, data?: any[T]) => {
    const itemByName = initialList?.find(item => {
      return item.name === String(name);
    });

    if (data && itemByName) {
      itemByName.data = data;
    }

    if (itemByName) {
      visiblePool.value?.push(itemByName);
    }
  };

  const removeVisibleItem = (name: any) => {
    visiblePool.value = visiblePool.value?.filter(item => {
      return item.name !== String(name);
    });
  };

  watch(
    () => visiblePool.value.length,
    val => {
      document.body.classList.toggle('--no-scroll', val > 0);
    }
  );

  return {
    visiblePool,
    isItemInPool,
    addVisibleItem,
    removeVisibleItem,
  };
});
