import { RoughGenerator } from "roughjs/bin/generator";
import type {
  ElementShape,
  ElementShapes,
} from "@swell-draw/swellDraw/scene/types";
import {
  NonDeletedSwellDrawElement,
  SwellDrawElement,
  SwellDrawSelectionElement,
} from ".";
import { elementWithCanvasCache } from "./renderElement";
import { assertNever, isTransparent, ROUGHNESS } from "@swell-draw/common";
import { Drawable, Options } from "roughjs/bin/core";

export class ShapeCache {
  private static rg = new RoughGenerator();
  private static cache = new WeakMap<SwellDrawElement, ElementShape>();

  /**
   * Retrieves shape from cache if available. Use this only if shape
   * is optional and you have a fallback in case it's not cached.
   */
  public static get = <T extends SwellDrawElement>(element: T) => {
    return ShapeCache.cache.get(
      element,
    ) as T["type"] extends keyof ElementShapes
      ? ElementShapes[T["type"]] | undefined
      : ElementShape | undefined;
  };

  public static set = <T extends SwellDrawElement>(
    element: T,
    shape: T["type"] extends keyof ElementShapes
      ? ElementShapes[T["type"]]
      : Drawable,
  ) => ShapeCache.cache.set(element, shape);

  public static delete = (element: SwellDrawElement) =>
    ShapeCache.cache.delete(element);

  public static destroy = () => {
    ShapeCache.cache = new WeakMap();
  };

  /**
   * Generates & caches shape for element if not already cached, otherwise
   * returns cached shape.
   */
  public static generateElementShape = <
    T extends Exclude<SwellDrawElement, SwellDrawSelectionElement>,
  >(
    element: T,
  ) => {
    // when exporting, always regenerated to guarantee the latest shape
    const cachedShape = ShapeCache.get(element);

    // `null` indicates no rc shape applicable for this element type,
    // but it's considered a valid cache value (= do not regenerate)
    if (cachedShape !== undefined) {
      return cachedShape;
    }

    elementWithCanvasCache.delete(element);

    const shape = generateElementShape(
      element,
      ShapeCache.rg,
    ) as T["type"] extends keyof ElementShapes
      ? ElementShapes[T["type"]]
      : Drawable | null;

    ShapeCache.cache.set(element, shape);

    return shape;
  };
}

/**
 * Generates the roughjs shape for given element.
 *
 * Low-level. Use `ShapeCache.generateElementShape` instead.
 *
 * @private
 */
const generateElementShape = (
  element: Exclude<NonDeletedSwellDrawElement, SwellDrawSelectionElement>,
  generator: RoughGenerator,
): Drawable | Drawable[] | null => {
  switch (element.type) {
    case "rectangle": {
      const shape: ElementShapes[typeof element.type] = generator.rectangle(
        0,
        0,
        element.width,
        element.height,
        generateRoughOptions(element, false),
      );

      return shape;
    }
    default: {
      assertNever(
        element,
        `generateElementShape(): Unimplemented type ${element?.type}`,
      );
      return null;
    }
  }
};

export const generateRoughOptions = (
  element: SwellDrawElement,
  continuousPath = false,
): Options => {
  const options: Options = {
    seed: element.seed,
    strokeLineDash: undefined,
    // for non-solid strokes, disable multiStroke because it tends to make
    // dashes/dots overlay each other
    disableMultiStroke: element.strokeStyle !== "solid",
    // for non-solid strokes, increase the width a bit to make it visually
    // similar to solid strokes, because we're also disabling multiStroke
    strokeWidth:
      element.strokeStyle !== "solid"
        ? element.strokeWidth + 0.5
        : element.strokeWidth,
    // when increasing strokeWidth, we must explicitly set fillWeight and
    // hachureGap because if not specified, roughjs uses strokeWidth to
    // calculate them (and we don't want the fills to be modified)
    fillWeight: element.strokeWidth / 2,
    hachureGap: element.strokeWidth * 4,
    roughness: adjustRoughness(element),
    stroke: element.strokeColor,
    preserveVertices:
      continuousPath || element.roughness < ROUGHNESS.cartoonist,
  };

  switch (element.type) {
    case "rectangle":
    case "diamond":
    case "ellipse": {
      options.fillStyle = element.fillStyle;
      options.fill = isTransparent(element.backgroundColor)
        ? undefined
        : element.backgroundColor;
      if (element.type === "ellipse") {
        options.curveFitting = 1;
      }
      return options;
    }
    default: {
      throw new Error(`Unimplemented type ${element.type}`);
    }
  }
};

function adjustRoughness(element: SwellDrawElement): number {
  const roughness = element.roughness;

  const maxSize = Math.max(element.width, element.height);
  const minSize = Math.min(element.width, element.height);

  // don't reduce roughness if
  if (
    // both sides relatively big
    minSize >= 20 &&
    maxSize >= 50
  ) {
    return roughness;
  }

  return Math.min(roughness / (maxSize < 10 ? 3 : 2), 2.5);
}
