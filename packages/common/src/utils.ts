/* eslint-disable @typescript-eslint/no-explicit-any */
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

/**
 * 基于 `opts` 对象的值进行记忆化缓存（严格相等比较）
 *
 * @param func 需要缓存的函数
 * @returns 返回带有缓存功能的函数，包含 clear 方法用于清除缓存
 */
export const memoize = <T extends Record<string, any>, R>(
  func: (opts: T) => R,
) => {
  let lastArgs: Map<string, any> | undefined; // 上次调用的参数
  let lastResult: R | undefined; // 上次调用的结果

  const ret = function (opts: T) {
    const currentArgs = Object.entries(opts); // 当前调用的参数

    // 如果存在上次的参数，进行严格相等比较
    if (lastArgs) {
      let argsAreEqual = true;
      for (const [key, value] of currentArgs) {
        if (lastArgs.get(key) !== value) {
          argsAreEqual = false;
          break;
        }
      }
      // 如果参数相同，直接返回缓存的结果
      if (argsAreEqual) {
        return lastResult;
      }
    }

    // 参数不同，执行原函数
    const result = func(opts);

    // 更新缓存的参数和结果
    lastArgs = new Map(currentArgs);
    lastResult = result;

    return result;
  };

  // 添加清除缓存的方法
  ret.clear = () => {
    lastArgs = undefined;
    lastResult = undefined;
  };

  return ret as typeof func & { clear: () => void };
};
