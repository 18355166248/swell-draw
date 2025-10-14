import { ENV } from "./constant";

export const isTestEnv = () => import.meta.env.MODE === ENV.TEST;

export const isDevEnv = () => import.meta.env.MODE === ENV.DEVELOPMENT;

export const isProdEnv = () => import.meta.env.MODE === ENV.PRODUCTION;

export const capitalizeString = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toIterable = <T>(
  values: readonly T[] | ReadonlyMap<string, T>,
): Iterable<T> => {
  return Array.isArray(values) ? values : values.values();
};

/**
 * Converts a readonly array or map into an array.
 */
export const toArray = <T>(
  values: readonly T[] | ReadonlyMap<string, T>,
): T[] => {
  return Array.isArray(values) ? values : Array.from(toIterable(values));
};

export const getUpdatedTimestamp = () => (isTestEnv() ? 1 : Date.now());

/**
 * 将元组转换为坐标对象
 * @param xyTuple 元组
 * @returns 坐标对象
 */
export const tupleToCoors = (
  xyTuple: readonly [number, number],
): { x: number; y: number } => {
  const [x, y] = xyTuple;
  return { x, y };
};

/**
 * 计算两个坐标之间的距离
 * @param x 坐标x
 * @param y 坐标y
 * @returns 距离
 */
export const distance = (x: number, y: number) => Math.abs(x - y);

// -----------------------------------------------------------------------------
type HasBrand<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T]: K extends `~brand${infer _}` ? true : never;
}[keyof T];

type RemoveAllBrands<T> =
  HasBrand<T> extends true
    ? {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [K in keyof T as K extends `~brand~${infer _}` ? never : K]: T[K];
      }
    : never;

// adapted from https://github.com/colinhacks/zod/discussions/1994#discussioncomment-6068940
// currently does not cover all types (e.g. tuples, promises...)
type Unbrand<T> =
  T extends Map<infer E, infer F>
    ? Map<E, F>
    : T extends Set<infer E>
      ? Set<E>
      : T extends Array<infer E>
        ? Array<E>
        : RemoveAllBrands<T>;

/**
 * Makes type into a branded type, ensuring that value is assignable to
 * the base ubranded type. Optionally you can explicitly supply current value
 * type to combine both (useful for composite branded types. Make sure you
 * compose branded types which are not composite themselves.)
 */
export const toBrandedType = <BrandedType, CurrentType = BrandedType>(
  value: Unbrand<BrandedType>,
) => {
  return value as CurrentType & BrandedType;
};
