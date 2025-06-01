import { ref, watch, onBeforeUnmount, type Ref } from 'vue';

export interface DebounceReturn<T> {
  value: Ref<T>;
  debouncedValue: Ref<T>;
}

/**
 * Debounce a value to prevent excessive updates
 * @param initialValue - Initial value
 * @param delay - Delay in milliseconds
 * @returns Object with value and debouncedValue refs
 */
export function useDebounce<T>(initialValue: T, delay = 500): DebounceReturn<T> {
  const value = ref<T>(initialValue) as Ref<T>;
  const debouncedValue = ref<T>(initialValue) as Ref<T>;
  let timeout: number | null = null;

  const clearDebounceTimeout = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  watch(
    value,
    (newValue: T): void => {
      clearDebounceTimeout();

      timeout = window.setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    clearDebounceTimeout();
  });

  return {
    value,
    debouncedValue,
  };
}
