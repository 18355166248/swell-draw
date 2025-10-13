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
