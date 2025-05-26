export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Rends T and **all** its properties immutable.
 */
export type DeepReadonly<T> =
    // The functions remain unchanged
    T extends (...args: unknown[]) => unknown
        ? T
        : // Tables become ReadonlyArray<DeepReadonly<…>>
          T extends Array<infer U>
          ? ReadonlyArray<DeepReadonly<U>>
          : // Objects (interfaces): Readonly is added to each property
            T extends object
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : // Primitives and other types (String, Number, etc.)
              T;
