import {
  AppState,
  RenderableElementsMap,
  Zoom,
} from "@swell-draw/swellDraw/types";
import {
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
  SwellDrawElement,
} from "./index";
import { RoughCanvas } from "roughjs/bin/canvas";
import { ShapeCache } from "./shape";
import rough from "roughjs";

export interface SwellDrawElementWithCanvas {
  element: SwellDrawElement;
  canvas: HTMLCanvasElement;
  scale: number;
  zoomValue: AppState["zoom"]["value"];
  canvasOffsetX: number;
  canvasOffsetY: number;
}

export const elementWithCanvasCache = new WeakMap<
  SwellDrawElement,
  SwellDrawElementWithCanvas
>();

const getCanvasPadding = (element: SwellDrawElement) => {
  switch (element.type) {
    default:
      return 20;
  }
};

const cappedElementCanvasSize = (
  element: NonDeletedSwellDrawElement,
  zoom: Zoom,
): {
  width: number;
  height: number;
  scale: number;
} => {
  // Canvas 面积限制：16777216 像素（约 4096x4096）
  const AREA_LIMIT = 16777216;
  // Canvas 宽高限制：32767 像素（基于 Safari 浏览器的限制，参考 developer.mozilla.org）
  const WIDTH_HEIGHT_LIMIT = 32767;

  // 获取元素的内边距
  const padding = getCanvasPadding(element);
  // 获取元素的原始宽度和高度
  const elementWidth = element.width;
  const elementHeight = element.height;

  // 计算 Canvas 初始宽高：元素尺寸 × 设备像素比 + 两倍内边距
  let width = elementWidth * window.devicePixelRatio + padding * 2;
  let height = elementHeight * window.devicePixelRatio + padding * 2;

  // 初始缩放比例使用 zoom 值
  let scale: number = zoom.value;
  // 重新计算缩放比例，确保缩放后的宽高不超过浏览器限制
  if (
    width * scale > WIDTH_HEIGHT_LIMIT ||
    height * scale > WIDTH_HEIGHT_LIMIT
  ) {
    // 取宽度和高度两个维度中更小的缩放比例，确保两个维度都不超限
    scale = Math.min(WIDTH_HEIGHT_LIMIT / width, WIDTH_HEIGHT_LIMIT / height);
  }

  // 重新计算缩放比例，确保 Canvas 总面积不超过限制
  if (width * height * scale * scale > AREA_LIMIT) {
    // 根据面积限制反推出合适的缩放比例
    scale = Math.sqrt(AREA_LIMIT / (width * height));
  }

  // 应用缩放比例并向下取整，得到最终的 Canvas 尺寸
  width = Math.floor(width * scale);
  height = Math.floor(height * scale);

  return { width, height, scale };
};

const generateElementCanvas = (
  element: NonDeletedSwellDrawElement,
  elementsMap: NonDeletedSceneElementsMap,
  zoom: AppState["zoom"],
): SwellDrawElementWithCanvas | null => {
  // 创建离屏 canvas 元素并获取 2D 渲染上下文
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  // 获取元素所需的 canvas 内边距
  const padding = getCanvasPadding(element);

  // 计算经过限制后的 canvas 尺寸和缩放比例（防止 canvas 过大）
  const { width, height, scale } = cappedElementCanvasSize(element, zoom);

  // 如果计算出的尺寸无效，直接返回 null
  if (!width || !height) {
    return null;
  }

  // 设置 canvas 的实际尺寸
  canvas.width = width;
  canvas.height = height;

  // 初始化 canvas 偏移量（默认值用于非线性元素）
  const canvasOffsetX = -100;
  const canvasOffsetY = 0;

  // 保存当前 canvas 状态，以便后续恢复
  context.save();
  // 应用内边距偏移（考虑缩放）
  context.translate(padding * scale, padding * scale);
  // 应用缩放变换（考虑设备像素比和缩放比例）
  context.scale(
    window.devicePixelRatio * scale,
    window.devicePixelRatio * scale,
  );

  // 创建 Rough.js canvas 实例，用于绘制手绘风格的图形
  const rc = rough.canvas(canvas);

  // 在 canvas 上绘制元素
  drawElementOnCanvas(element, rc, context);

  // 恢复之前保存的 canvas 状态
  context.restore();

  // 返回渲染结果对象，包含所有渲染所需的信息
  return {
    element, // 原始元素对象
    canvas, // 主渲染 canvas
    scale, // 应用的缩放比例
    zoomValue: zoom.value, // 缩放值
    canvasOffsetX, // canvas X 轴偏移量
    canvasOffsetY, // canvas Y 轴偏移量
  };
};

const generateElementWithCanvas = (
  element: SwellDrawElement,
  elementsMap: NonDeletedSceneElementsMap,
  appState: AppState,
) => {
  const zoom = appState.zoom;
  const prevElementWithCanvas = elementWithCanvasCache.get(element);

  if (!prevElementWithCanvas) {
    const elementWithCanvas = generateElementCanvas(element, elementsMap, zoom);

    if (!elementWithCanvas) {
      return null;
    }

    elementWithCanvasCache.set(element, elementWithCanvas);

    return elementWithCanvas;
  }

  return prevElementWithCanvas;
};

export const renderElement = (
  element: NonDeletedSwellDrawElement,
  elementsMap: RenderableElementsMap,
  allElementsMap: NonDeletedSceneElementsMap,
  rc: RoughCanvas,
  context: CanvasRenderingContext2D,
  appState: AppState,
) => {
  switch (element.type) {
    case "rectangle":
    case "diamond":
    case "ellipse": {
      ShapeCache.generateElementShape(element);
      const elementWithCanvas = generateElementWithCanvas(
        element,
        allElementsMap,
        appState,
      );

      if (!elementWithCanvas) {
        return;
      }

      // 从缓存的画布绘制元素到主画布
      drawElementFromCanvas(elementWithCanvas, context, appState);
    }
  }
};

export const getElementAbsoluteCoords = (
  element: SwellDrawElement,
): [number, number, number, number, number, number] => {
  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
    element.x + element.width / 2,
    element.y + element.height / 2,
  ];
};

const drawElementFromCanvas = (
  elementWithCanvas: SwellDrawElementWithCanvas,
  context: CanvasRenderingContext2D,
  appState: AppState,
) => {
  const element = elementWithCanvas.element;
  const padding = getCanvasPadding(element);
  const [x1, y1] = getElementAbsoluteCoords(element);

  context.save();
  context.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);

  context.drawImage(
    elementWithCanvas.canvas!,
    (x1 + appState.scrollX) * window.devicePixelRatio -
      (padding * elementWithCanvas.scale) / elementWithCanvas.scale,
    (y1 + appState.scrollY) * window.devicePixelRatio -
      (padding * elementWithCanvas.scale) / elementWithCanvas.scale,
    elementWithCanvas.canvas!.width / elementWithCanvas.scale,
    elementWithCanvas.canvas!.height / elementWithCanvas.scale,
  );

  context.restore();
};

const drawElementOnCanvas = (
  element: NonDeletedSwellDrawElement,
  rc: RoughCanvas,
  context: CanvasRenderingContext2D,
) => {
  switch (element.type) {
    case "rectangle":
    case "diamond":
    case "ellipse": {
      context.lineJoin = "round";
      context.lineCap = "round";
      rc.draw(ShapeCache.get(element)!);
      break;
    }
    default: {
      throw new Error(`Unimplemented type ${element.type}`);
    }
  }
};
