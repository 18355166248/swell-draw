import {
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
  SwellDrawElement,
} from "@swell-draw/element";
import { RoughCanvas } from "roughjs/bin/canvas";
import {
  AppState,
  RenderableElementsMap,
  StaticCanvasAppState,
} from "../types";
import { Drawable } from "roughjs/bin/core";

export type NewElementSceneRenderConfig = {
  canvas: HTMLCanvasElement | null;
  rc: RoughCanvas;
  newElement: SwellDrawElement | null;
  elementsMap: RenderableElementsMap;
  allElementsMap: NonDeletedSceneElementsMap;
  scale: number;
  appState: AppState;
};

export type ElementShape = Drawable | Drawable[] | null;

export type ElementShapes = {
  rectangle: Drawable;
  ellipse: Drawable;
  diamond: Drawable;
  iframe: Drawable;
  embeddable: Drawable;
  freedraw: Drawable | null;
  arrow: Drawable[];
  line: Drawable[];
  text: null;
  image: null;
  frame: null;
  magicframe: null;
};

export type StaticSceneRenderConfig = {
  canvas: HTMLCanvasElement;
  rc: RoughCanvas;
  elementsMap: RenderableElementsMap;
  allElementsMap: NonDeletedSceneElementsMap;
  visibleElements: readonly NonDeletedSwellDrawElement[];
  scale: number;
  appState: StaticCanvasAppState;
};
