import { MakeBrand, Merge } from "@swell-draw/common/uitility-types";
import App from "./components/App";
import {
  NonDeleted,
  NonDeletedElementsMap,
  SwellDrawNonSelectionElement,
} from "@swell-draw/element";

export type PointerType = "mouse" | "pen" | "touch";

export type ToolType =
  | "selection" // 选择工具
  | "lasso" // 套索工具
  | "rectangle" // 矩形工具
  | "diamond" // 菱形工具
  | "ellipse" // 椭圆工具
  | "arrow" // 箭头工具
  | "line" // 直线工具
  | "freedraw" // 自由绘制工具
  | "text" // 文本工具
  | "image" // 图片工具
  | "eraser" // 橡皮擦工具
  | "hand" // 抓手工具
  | "frame" // 框架工具
  | "magicframe" // 魔法框架工具
  | "embeddable" // 嵌入工具
  | "laser"; // 激光笔工具

export type ActiveTool = {
  type: ToolType | "custom";
  customType: string | null;
};

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
  activeTool: ActiveTool;
  scrollX: number;
  scrollY: number;
  zoom: Zoom;
  offsetTop: number;
  offsetLeft: number;

  newElement: NonDeleted<SwellDrawNonSelectionElement> | null;

  gridSize: number;
  gridStep: number;
}

export type UIAppState = Omit<AppState, "scrollX" | "scrollY">;

export type AppClassProperties = {
  canvas: HTMLCanvasElement;
  interactiveCanvas: HTMLCanvasElement | null; // 交互式画布
  setActiveTool: App["setActiveTool"];
};

type _CommonCanvasAppState = {
  width: AppState["width"];
  height: AppState["height"];
  zoom: AppState["zoom"];
  scrollX: AppState["scrollX"];
  scrollY: AppState["scrollY"];
};

// 交互式画布的 app state
export type InteractiveCanvasAppState = Readonly<_CommonCanvasAppState & {}>;

export type StaticCanvasAppState = Readonly<
  _CommonCanvasAppState & {
    gridSize: AppState["gridSize"];
    gridStep: AppState["gridStep"];
  }
>;

// Stack 组件相关类型
export type StackProps = {
  children: React.ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justifyContent?: "center" | "space-around" | "space-between";
  className?: string | boolean;
  style?: React.CSSProperties;
};

export type NormalizedZoomValue = number & { _brand: "normalizedZoom" };

export type Zoom = Readonly<{
  value: NormalizedZoomValue;
}>;

export type PointerDownState = Readonly<{
  // The first position at which pointerDown happened
  origin: Readonly<{ x: number; y: number }>;
  originInGrid: Readonly<{ x: number; y: number }>;
  eventListeners: {
    onMove: null | ((event: PointerEvent) => void);
    onUp: null | ((event: PointerEvent) => void);
  };
  // 预览元素的最后坐标
  lastCoords: { x: number; y: number };
}>;

export type RenderableElementsMap = NonDeletedElementsMap &
  MakeBrand<"RenderableElementsMap">;
