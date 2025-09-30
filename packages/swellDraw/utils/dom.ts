import { Zoom } from "../types";

/**
 * 将视口坐标转换为场景坐标
 *
 * 该函数将浏览器视口中的像素坐标转换为 Excalidraw 画布中的逻辑坐标。
 * 转换过程考虑了缩放级别、画布偏移量和滚动位置。
 *
 * @param clientX - 鼠标或触摸事件在浏览器视口中的 X 坐标（像素）
 * @param clientY - 鼠标或触摸事件在浏览器视口中的 Y 坐标（像素）
 * @param zoom - 当前的缩放对象，包含缩放值
 * @param offsetLeft - 画布元素相对于视口左边缘的偏移量（像素）
 * @param offsetTop - 画布元素相对于视口顶部边缘的偏移量（像素）
 * @param scrollX - 画布的水平滚动偏移量（逻辑单位）
 * @param scrollY - 画布的垂直滚动偏移量（逻辑单位）
 * @returns 转换后的场景坐标 {x, y}（逻辑单位）
 *
 * @example
 * // 将鼠标点击位置转换为画布中的逻辑坐标
 * const sceneCoords = viewportCoordsToSceneCoords(
 *   { clientX: 100, clientY: 200 },
 *   { zoom: { value: 1.5 }, offsetLeft: 10, offsetTop: 20, scrollX: 50, scrollY: 30 }
 * );
 * // 结果: { x: 26.67, y: 100 }
 */
export const viewportCoordsToSceneCoords = (
  { clientX, clientY }: { clientX: number; clientY: number },
  {
    zoom,
    offsetLeft,
    offsetTop,
    scrollX,
    scrollY,
  }: {
    zoom: Zoom;
    offsetLeft: number;
    offsetTop: number;
    scrollX: number;
    scrollY: number;
  },
) => {
  // 首先减去画布偏移量，然后除以缩放值，最后减去滚动偏移量
  const x = (clientX - offsetLeft) / zoom.value - scrollX;
  const y = (clientY - offsetTop) / zoom.value - scrollY;

  return { x, y };
};
