import { SwellDrawElement } from "@swell-draw/element";

export const ENV = {
  TEST: "test",
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export enum EVENT {
  COPY = "copy",
  PASTE = "paste",
  CUT = "cut",
  KEYDOWN = "keydown",
  KEYUP = "keyup",
  MOUSE_MOVE = "mousemove",
  RESIZE = "resize",
  UNLOAD = "unload",
  FOCUS = "focus",
  BLUR = "blur",
  DRAG_OVER = "dragover",
  DROP = "drop",
  GESTURE_END = "gestureend",
  BEFORE_UNLOAD = "beforeunload",
  GESTURE_START = "gesturestart",
  GESTURE_CHANGE = "gesturechange",
  POINTER_MOVE = "pointermove",
  POINTER_DOWN = "pointerdown",
  POINTER_UP = "pointerup",
  STATE_CHANGE = "statechange",
  WHEEL = "wheel",
  TOUCH_START = "touchstart",
  TOUCH_END = "touchend",
  HASHCHANGE = "hashchange",
  VISIBILITY_CHANGE = "visibilitychange",
  SCROLL = "scroll",
}

export const isIOS =
  /iPad|iPhone/i.test(navigator.platform) ||
  // iPadOS 13+
  (navigator.userAgent.includes("Mac") && "ontouchend" in document);

export const isDarwin = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export const DEFAULT_ELEMENT_PROPS: {
  strokeColor: SwellDrawElement["strokeColor"];
  backgroundColor: SwellDrawElement["backgroundColor"];
  fillStyle: SwellDrawElement["fillStyle"];
  strokeWidth: SwellDrawElement["strokeWidth"];
  strokeStyle: SwellDrawElement["strokeStyle"];
  roughness: SwellDrawElement["roughness"];
  opacity: SwellDrawElement["opacity"];
  locked: SwellDrawElement["locked"];
} = {
  strokeColor: "#000",
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  locked: false,
};

export const ROUGHNESS = {
  architect: 0,
  artist: 1,
  cartoonist: 2,
} as const;

export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_GRID_STEP = 5;
