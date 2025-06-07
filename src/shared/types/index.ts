// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * XOR type
 * @description Returns a type that is either T or U, but not both
 * @example
 * type A = { a: string };
 * type B = { b: number };
 * type C = XOR<A, B>; // C is either { a: string } or { b: number }
 */
export type XOR<T, U> = (T & { [K in keyof U]?: never }) | (U & { [K in keyof T]?: never });
