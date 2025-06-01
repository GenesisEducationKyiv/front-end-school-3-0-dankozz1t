// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & RequiredKeys<T, K>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Record<K, NonNullable<T[K]>>;
