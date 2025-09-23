import { ENV } from "./constant";

export const isTestEnv = () => import.meta.env.MODE === ENV.TEST;

export const isDevEnv = () => import.meta.env.MODE === ENV.DEVELOPMENT;

export const isProdEnv = () => import.meta.env.MODE === ENV.PRODUCTION;
