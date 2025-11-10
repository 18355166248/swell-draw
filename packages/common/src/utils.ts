/* eslint-disable @typescript-eslint/no-explicit-any */
import { COLOR_PALETTE } from './colors';
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

/**
 * 基于 requestAnimationFrame 的节流函数
 * 将回调函数的执行频率限制为每帧最多执行一次，与浏览器刷新率同步（通常 60fps）
 *
 * @template T - 回调函数的参数类型数组
 * @param {(...args: T) => void} fn - 需要被节流的回调函数
 * @param {Object} [opts] - 可选配置项
 * @param {boolean} [opts.trailing] - 是否启用 trailing 模式。如果为 true，当有新的调用时，
 *                                    即使当前帧已调度，也会保存最新参数并在当前执行后再次执行
 * @returns {Function} 返回一个节流后的函数，该函数包含以下方法：
 *   - `flush()`: 立即执行并清空待执行的调用
 *   - `cancel()`: 取消所有待执行的调用
 *
 * @example
 * // 基本用法：限制滚动事件处理频率
 * const handleScroll = throttleRAF((event) => {
 *   console.log('滚动位置:', event.scrollY);
 * });
 * window.addEventListener('scroll', handleScroll);
 *
 * @example
 * // 使用 trailing 模式：确保处理最新的数据
 * const updateUI = throttleRAF((data) => {
 *   render(data);
 * }, { trailing: true });
 */
export const throttleRAF = <T extends any[]>(
  fn: (...args: T) => void,
  opts?: { trailing?: boolean },
) => {
  // 当前待执行的 requestAnimationFrame ID，null 表示没有待执行的调用
  let timerId: number | null = null;
  // 最后一次调用时传入的参数（用于当前帧执行）
  let lastArgs: T | null = null;
  // 在 trailing 模式下，保存最新的调用参数（用于当前执行后的再次执行）
  let lastArgsTrailing: T | null = null;

  /**
   * 调度函数执行到下一帧
   * 使用 requestAnimationFrame 确保函数在浏览器下一帧渲染时执行
   *
   * @param {T} args - 要传递给回调函数的参数
   */
  const scheduleFunc = (args: T) => {
    // 注册一个动画帧回调
    timerId = window.requestAnimationFrame(() => {
      // 执行完成后清空 timerId，表示当前没有待执行的调用
      timerId = null;
      // 执行回调函数
      fn(...args);
      // 清空当前参数
      lastArgs = null;

      // 如果启用了 trailing 模式且有新的参数等待执行
      // 则递归调度执行最新参数，确保处理最新的数据
      if (lastArgsTrailing) {
        lastArgs = lastArgsTrailing;
        lastArgsTrailing = null;
        scheduleFunc(lastArgs);
      }
    });
  };

  /**
   * 节流后的函数
   * 每次调用时，如果当前没有待执行的调用，则调度到下一帧执行
   * 如果已有待执行的调用，则根据 trailing 配置决定是否保存最新参数
   *
   * @param {...T} args - 传递给回调函数的参数
   */
  const ret = (...args: T) => {
    // 测试环境下直接执行，不进行节流，便于单元测试
    if (isTestEnv()) {
      fn(...args);
      return;
    }

    // 保存当前调用的参数
    lastArgs = args;

    // 如果当前没有待执行的调用，立即调度到下一帧执行
    if (timerId === null) {
      scheduleFunc(lastArgs);
    }
    // 如果已有待执行的调用且启用了 trailing 模式
    // 保存最新参数，将在当前执行完成后再次执行
    else if (opts?.trailing) {
      lastArgsTrailing = args;
    }
    // 如果已有待执行的调用且未启用 trailing 模式
    // 则忽略当前调用（不做任何处理）
  };

  /**
   * 立即执行并清空所有待执行的调用
   * 取消当前待执行的动画帧，并立即执行最后一次保存的参数
   * 用于需要立即更新的场景（如组件卸载时）
   */
  ret.flush = () => {
    // 如果有待执行的动画帧，取消它
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }

    // 如果有保存的参数，立即执行
    // 优先执行 trailing 参数（如果存在），否则执行 lastArgs
    if (lastArgs) {
      fn(...(lastArgsTrailing || lastArgs));
      // 清空所有保存的参数
      lastArgs = lastArgsTrailing = null;
    }
  };

  /**
   * 取消所有待执行的调用
   * 清空所有保存的参数，并取消待执行的动画帧
   * 用于需要完全停止执行的场景
   */
  ret.cancel = () => {
    // 清空所有保存的参数
    lastArgs = lastArgsTrailing = null;

    // 如果有待执行的动画帧，取消它
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
  };

  return ret;
};

/**
 * supply `null` as message if non-never value is valid, you just need to
 * typecheck against it
 */
export const assertNever = (
  value: any,
  message: string | null,
  softAssert?: boolean,
): any => {
  if (!message) {
    return value;
  }
  if (softAssert) {
    console.error(message);
    return value;
  }

  throw new Error(message);
};

export const isTransparent = (color: string) => {
  const isRGBTransparent = color.length === 5 && color.substr(4, 1) === "0";
  const isRRGGBBTransparent = color.length === 9 && color.substr(7, 2) === "00";
  return (
    isRGBTransparent ||
    isRRGGBBTransparent ||
    color === COLOR_PALETTE.transparent
  );
};
