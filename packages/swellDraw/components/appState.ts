import { AppState } from "../types";

export const getDefaultAppState = (): Omit<AppState, "width" | "height"> => {
  return {
    isLoading: true,
    activeTool: {
      type: "selection",
      customType: null,
    },
    scrollX: 0,
    scrollY: 0,
  };
};
