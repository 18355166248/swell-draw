import { SwellDrawElement } from "./types";

export const getNormalizedDimensions = (
  element: Pick<SwellDrawElement, "width" | "height" | "x" | "y">,
): {
  width: SwellDrawElement["width"];
  height: SwellDrawElement["height"];
  x: SwellDrawElement["x"];
  y: SwellDrawElement["y"];
} => {
  const ret = {
    width: element.width,
    height: element.height,
    x: element.x,
    y: element.y,
  };

  if (element.width < 0) {
    const nextWidth = Math.abs(element.width);
    ret.width = nextWidth;
    ret.x = element.x - nextWidth;
  }

  if (element.height < 0) {
    const nextHeight = Math.abs(element.height);
    ret.height = nextHeight;
    ret.y = element.y - nextHeight;
  }

  return ret;
};
