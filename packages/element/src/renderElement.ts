import { AppState, RenderableElementsMap } from "@swell-draw/swellDraw/types";
import {
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
  SwellDrawElement,
} from "./index";
import { RoughCanvas } from "roughjs/bin/canvas";
import { ShapeCache } from "./shape";

export interface SwellDrawElementWithCanvas {
  element: SwellDrawElement;
  canvas: HTMLCanvasElement;
  scale: number;
  angle: number;
  zoomValue: AppState["zoom"]["value"];
  canvasOffsetX: number;
  canvasOffsetY: number;
  boundTextElementVersion: number | null;
  containingFrameOpacity: number;
  boundTextCanvas: HTMLCanvasElement;
}

export const elementWithCanvasCache = new WeakMap<
  SwellDrawElement,
  SwellDrawElementWithCanvas
>();

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
      console.log(elementsMap, allElementsMap, rc, context, appState);
    }
  }
};
