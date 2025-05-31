export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface SearchParams {
  search?: string;
}

export type QueryOptions = PaginationParams & SortParams & SearchParams & FilterParams;

// Modal and UI related types
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timeout?: number;
}

// Enhanced form types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  valid: boolean;
  submitting: boolean;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & RequiredKeys<T, K>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Record<K, NonNullable<T[K]>>;

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Generic store state pattern
export interface StoreState<T> extends LoadingState {
  items: T[];
  selectedItems: string[];
  filters: FilterParams;
  sort: SortParams;
  pagination: PaginationParams;
}

// File upload types
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  uploading: boolean;
  progress: FileUploadProgress | null;
  error: string | null;
}

// Component prop patterns
export interface WithLoading {
  loading?: boolean;
}

export interface WithError {
  error?: string | null;
}

export interface WithDisabled {
  disabled?: boolean;
}

// Event handler types
export type ClickHandler = (event: MouseEvent) => void;
export type SubmitHandler<T = unknown> = (data: T) => void | Promise<void>;
export type ChangeHandler<T = unknown> = (value: T) => void;

// Validation types
export type ValidationRule<T = unknown> = (value: T) => string | null;
export type ValidatorFunction<T> = (data: T) => FormFieldError[];

// Theme and styling
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ComponentSize = 'small' | 'medium' | 'large';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
