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
  };
};
