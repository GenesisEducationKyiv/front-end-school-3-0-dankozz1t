import { ref, watch, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { O, pipe, type Option } from '@mobily/ts-belt';
import { useDebounce } from '@/shared/composables/useDebounce';
import type { TrackSortField, TrackSortOrder } from '../types';

export interface UrlFilters {
  search?: string;
  genre?: string;
  artist?: string;
  sortBy?: TrackSortField;
  sortOrder?: TrackSortOrder;
  page?: number;
  itemsPerPage?: number;
}

export interface UseUrlFiltersReturn {
  initializeFromUrl: () => UrlFilters;
  updateUrl: (filters: UrlFilters) => void;
  updateUrlDebounced: (filters: UrlFilters) => void;
  clearUrl: () => void;
  isInitialized: Ref<boolean>;
}

export function useUrlFilters(): UseUrlFiltersReturn {
  const router = useRouter();
  const route = useRoute();
  const isInitialized = ref(false);

  const getQueryParam = (key: string): Option<string> => {
    return pipe(
      route.query[key],
      O.fromNullable,
      O.flatMap(value => (Array.isArray(value) ? pipe(value[0], O.fromNullable) : O.Some(value))),
      O.flatMap(value =>
        typeof value === 'string' && value.trim() !== '' ? O.Some(value.trim()) : O.None
      )
    );
  };

  const parseToNumber = (value: string) =>
    pipe(parseInt(value, 10), parsed => (isNaN(parsed) ? O.None : O.Some(parsed)));

  const validateSortOrder = (value: string) =>
    pipe(value, order =>
      ['asc', 'desc'].includes(order) ? O.Some(order as TrackSortOrder) : O.None
    );

  const validatePositiveNumber = (value: number) => (value > 0 ? O.Some(value) : O.None);

  const validateItemsPerPage = (value: number) =>
    [10, 20, 50, 100].includes(value) ? O.Some(value) : O.None;

  function initializeFromUrl(): UrlFilters {
    return pipe({} as UrlFilters, filters => {
      O.map(getQueryParam('search'), search => {
        filters.search = search;
        return search;
      });
      O.map(getQueryParam('genre'), genre => {
        filters.genre = genre;
        return genre;
      });
      O.map(getQueryParam('artist'), artist => {
        filters.artist = artist;
        return artist;
      });
      O.map(getQueryParam('sortBy'), sortBy => {
        filters.sortBy = sortBy as TrackSortField;
        return sortBy;
      });

      O.map(pipe(getQueryParam('sortOrder'), O.flatMap(validateSortOrder)), sortOrder => {
        filters.sortOrder = sortOrder;
        return sortOrder;
      });

      O.map(
        pipe(getQueryParam('page'), O.flatMap(parseToNumber), O.flatMap(validatePositiveNumber)),
        page => {
          filters.page = page;
          return page;
        }
      );

      O.map(
        pipe(
          getQueryParam('itemsPerPage'),
          O.flatMap(parseToNumber),
          O.flatMap(validateItemsPerPage)
        ),
        itemsPerPage => {
          filters.itemsPerPage = itemsPerPage;
          return itemsPerPage;
        }
      );

      isInitialized.value = true;
      return filters;
    });
  }

  const buildQuery = (filters: UrlFilters): Record<string, string> => {
    const defaultValues = {
      page: 1,
      itemsPerPage: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };

    return pipe(Object.entries(filters) as Array<[keyof UrlFilters, any]>, entries =>
      entries.reduce(
        (acc, [key, value]) => {
          if (value === undefined || value === null || value === '') return acc;

          if (key in defaultValues && value === defaultValues[key as keyof typeof defaultValues]) {
            return acc;
          }

          acc[key] = value.toString();
          return acc;
        },
        {} as Record<string, string>
      )
    );
  };

  function updateUrl(filters: UrlFilters): void {
    if (!isInitialized.value) return;

    const query = buildQuery(filters);

    router.replace({
      path: route.path,
      query: Object.keys(query).length > 0 ? query : {},
    });
  }

  const { value: filtersInput, debouncedValue: debouncedFilters } = useDebounce<UrlFilters | null>(
    null,
    500
  );

  watch(debouncedFilters, filters => {
    if (filters) {
      updateUrl(filters);
    }
  });

  function updateUrlDebounced(filters: UrlFilters): void {
    filtersInput.value = filters;
  }

  function clearUrl(): void {
    if (!isInitialized.value) return;
    router.replace({ path: route.path, query: {} });
  }

  return {
    initializeFromUrl,
    updateUrl,
    updateUrlDebounced,
    clearUrl,
    isInitialized,
  };
}
