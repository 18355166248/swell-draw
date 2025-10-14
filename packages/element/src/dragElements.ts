import type { NonDeletedSwellDrawElement } from "@swell-draw/element/types";
import { NormalizedZoomValue } from "@swell-draw/swellDraw/types";
import { Scene } from "./Scene";

export const dragNewElement = ({
  newElement,
  originX,
  originY,
  x,
  y,
  width,
  height,
  scene,
  originOffset = null,
}: {
  newElement: NonDeletedSwellDrawElement;
  originX: number;
  originY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scene: Scene;
  zoom: NormalizedZoomValue;
  originOffset?: {
    x: number;
    y: number;
  } | null;
}) => {
  // 计算元素的新位置
  const newX = x < originX ? originX - width : originX;
  const newY = y < originY ? originY - height : originY;

  if (width !== 0 && height !== 0) {
    // 更新元素属性
    scene.mutateElement(
      newElement,
      {
        x: newX + (originOffset?.x ?? 0),
        y: newY + (originOffset?.y ?? 0),
        width,
        height,
      },
      { isDragging: false },
    );
  }
};
