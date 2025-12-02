import { DEFAULT_GRID_SIZE, DEFAULT_GRID_STEP } from '@swell-draw/common';
import { AppState, NormalizedZoomValue } from "../types";

export const getDefaultAppState = (): Omit<
  AppState,
  "width" | "height" | "offsetTop" | "offsetLeft"
> => {
  return {
    isLoading: true,
    activeTool: {
      type: "rectangle",
      customType: null,
    },
    scrollX: 0,
    scrollY: 0,
    zoom: {
      value: 1 as NormalizedZoomValue,
    },
    newElement: null,
    gridSize: DEFAULT_GRID_SIZE,
    gridStep: DEFAULT_GRID_STEP,
  };
};
