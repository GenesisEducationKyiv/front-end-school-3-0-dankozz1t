import { z } from 'zod';

export const TrackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().optional(),
  genres: z.array(z.string()),
  slug: z.string().min(1),
  coverImage: z.string().url().optional(),
  audioFile: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TrackFormDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  coverImage: z.string().url().optional(),
});

export const PaginationMetaSchema = z.object({
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(0),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: PaginationMetaSchema,
  });

export const QueryParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.enum(['title', 'artist', 'album', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  genre: z.string().optional(),
  artist: z.string().optional(),
});

export const BatchDeleteResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string()),
});

export type Track = z.infer<typeof TrackSchema>;
export type TrackFormData = z.infer<typeof TrackFormDataSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type BatchDeleteResponse = z.infer<typeof BatchDeleteResponseSchema>;

export interface TrackFilters {
  searchQuery: string;
  selectedGenre: string | null;
  selectedArtist: string | null;
}

export interface TrackSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export type TrackSortField = NonNullable<QueryParams['sort']>;
export type TrackSortOrder = NonNullable<QueryParams['order']>;
