export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Merge<M, N> = Omit<M, keyof N> & N;

// 原始版本：包含所有路径（包括对象路径）
export type NestedTypeOf<T, K extends keyof T = keyof T> = K extends keyof T &
  (string | number)
  ? `${K}` | (T[K] extends object ? `${K}.${NestedTypeOf<T[K]>}` : never)
  : never;

// 只包含叶子节点路径的版本（排除对象路径）
export type LeafKeyOf<T, K extends keyof T = keyof T> = K extends keyof T &
  (string | number)
  ? T[K] extends object
    ? `${K}.${LeafKeyOf<T[K]>}`
    : `${K}`
  : never;

// https://github.com/krzkaczor/ts-essentials
export type MarkOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type MakeBrand<T extends string> = {
  /** @private using ~ to sort last in intellisense */
  [K in `~brand~${T}`]: T;
};
