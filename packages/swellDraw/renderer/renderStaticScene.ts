import { throttleRAF } from "@swell-draw/common";
import { bootstrapCanvas, getNormalizedCanvasDimensions } from "./helpers";
import { StaticSceneRenderConfig } from "../scene/types";
import { Zoom } from "../types";

const GridLineColor = {
  Bold: "#dddddd",
  Regular: "#e5e5e5",
} as const;

const strokeGrid = (
  context: CanvasRenderingContext2D,
  /** grid cell pixel size */
  gridSize: number,
  /** setting to 1 will disble bold lines */
  gridStep: number,
  scrollX: number,
  scrollY: number,
  zoom: Zoom,
  width: number,
  height: number,
) => {
  const offsetX = (scrollX % gridSize) - gridSize;
  const offsetY = (scrollY % gridSize) - gridSize;

  const actualGridSize = gridSize * zoom.value;

  const spaceWidth = 1 / zoom.value;

  context.save();

  // Offset rendering by 0.5 to ensure that 1px wide lines are crisp.
  // We only do this when zoomed to 100% because otherwise the offset is
  // fractional, and also visibly offsets the elements.
  // We also do this per-axis, as each axis may already be offset by 0.5.
  if (zoom.value === 1) {
    context.translate(offsetX % 1 ? 0 : 0.5, offsetY % 1 ? 0 : 0.5);
  }

  // vertical lines
  for (let x = offsetX; x < offsetX + width + gridSize * 2; x += gridSize) {
    const isBold =
      gridStep > 1 && Math.round(x - scrollX) % (gridStep * gridSize) === 0;
    // don't render regular lines when zoomed out and they're barely visible
    if (!isBold && actualGridSize < 10) {
      continue;
    }

    const lineWidth = Math.min(1 / zoom.value, isBold ? 4 : 1);
    context.lineWidth = lineWidth;
    const lineDash = [lineWidth * 3, spaceWidth + (lineWidth + spaceWidth)];

    context.beginPath();
    context.setLineDash(isBold ? [] : lineDash);
    context.strokeStyle = isBold ? GridLineColor.Bold : GridLineColor.Regular;
    context.moveTo(x, offsetY - gridSize);
    context.lineTo(x, Math.ceil(offsetY + height + gridSize * 2));
    context.stroke();
  }

  for (let y = offsetY; y < offsetY + height + gridSize * 2; y += gridSize) {
    const isBold =
      gridStep > 1 && Math.round(y - scrollY) % (gridStep * gridSize) === 0;
    if (!isBold && actualGridSize < 10) {
      continue;
    }

    const lineWidth = Math.min(1 / zoom.value, isBold ? 4 : 1);
    context.lineWidth = lineWidth;
    const lineDash = [lineWidth * 3, spaceWidth + (lineWidth + spaceWidth)];

    context.beginPath();
    context.setLineDash(isBold ? [] : lineDash);
    context.strokeStyle = isBold ? GridLineColor.Bold : GridLineColor.Regular;
    context.moveTo(offsetX - gridSize, y);
    context.lineTo(Math.ceil(offsetX + width + gridSize * 2), y);
    context.stroke();
  }
  context.restore();
};

const _renderStaticScene = ({
  canvas,
  rc,
  elementsMap,
  allElementsMap,
  visibleElements,
  scale,
  appState,
}: StaticSceneRenderConfig) => {
  console.log(
    "renderStaticScene",
    canvas,
    rc,
    elementsMap,
    allElementsMap,
    visibleElements,
    scale,
    appState,
  );
  if (canvas === null) {
    return;
  }
  const [normalizedWidth, normalizedHeight] = getNormalizedCanvasDimensions(
    canvas,
    scale,
  );

  // 初始化画布上下文，设置尺寸、主题和背景色
  const context = bootstrapCanvas({
    canvas,
    scale,
    normalizedWidth,
    normalizedHeight,
  });

  // 渲染网格（如果启用）
  strokeGrid(
    context,
    appState.gridSize,
    appState.gridStep,
    appState.scrollX,
    appState.scrollY,
    appState.zoom,
    normalizedWidth / appState.zoom.value,
    normalizedHeight / appState.zoom.value,
  );
};

/** throttled to animation framerate */
export const renderStaticSceneThrottled = throttleRAF(
  (config: StaticSceneRenderConfig) => {
    _renderStaticScene(config);
  },
  { trailing: true },
);

/**
 * Static scene is the non-ui canvas where we render elements.
 */
export const renderStaticScene = (
  renderConfig: StaticSceneRenderConfig,
  throttle?: boolean,
) => {
  if (throttle) {
    renderStaticSceneThrottled(renderConfig);
    return;
  }

  _renderStaticScene(renderConfig);
};
