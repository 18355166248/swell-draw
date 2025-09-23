// 原始版本：包含所有路径（包括对象路径）
export type NestedKeyof<T, K extends keyof T = keyof T> = K extends keyof T &
  (string | number)
  ? `${K}` | (T[K] extends object ? `${K}.${NestedKeyof<T[K]>}` : never)
  : never;

// 只包含叶子节点路径的版本（排除对象路径）
export type LeafKeyof<T, K extends keyof T = keyof T> = K extends keyof T &
  (string | number)
  ? T[K] extends object
    ? `${K}.${LeafKeyof<T[K]>}`
    : `${K}`
  : never;
