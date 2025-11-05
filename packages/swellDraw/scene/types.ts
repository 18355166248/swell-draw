import {
  NonDeletedSceneElementsMap,
  SwellDrawElement,
} from "@swell-draw/element";
import { RoughCanvas } from "roughjs/bin/canvas";
import { AppState, RenderableElementsMap } from "../types";

export type NewElementSceneRenderConfig = {
  canvas: HTMLCanvasElement | null;
  rc: RoughCanvas;
  newElement: SwellDrawElement | null;
  elementsMap: RenderableElementsMap;
  allElementsMap: NonDeletedSceneElementsMap;
  scale: number;
  appState: AppState;
};
