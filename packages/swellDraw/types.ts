import { Merge } from "@swell-draw/common/uitility-types";

export interface SwellDrawProps {
  children?: React.ReactNode;
}

export type AppProps = Merge<
  SwellDrawProps,
  {
    children?: React.ReactNode;
  }
>;

export interface AppState {
  isLoading: boolean;
  width: number;
  height: number;
}

export type AppClassProperties = {
  canvas: HTMLCanvasElement;
  interactiveCanvas: HTMLCanvasElement | null; // 交互式画布
};

type _CommonCanvasAppState = {
  width: AppState["width"];
  height: AppState["height"];
};

// 交互式画布的 app state
export type InteractiveCanvasAppState = Readonly<_CommonCanvasAppState & {}>;
