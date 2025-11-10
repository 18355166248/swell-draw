/**
 * 获取标准化的画布尺寸
 * 在进行基于画布宽度的计算时，应该使用标准化后的尺寸
 *
 * @param canvas - HTML画布元素
 * @param scale - 缩放比例
 * @returns 返回标准化后的画布宽度和高度 [width, height]
 */
export const getNormalizedCanvasDimensions = (
  canvas: HTMLCanvasElement,
  scale: number,
): [number, number] => {
  // 当基于画布宽度进行计算时，应该使用标准化后的尺寸
  return [canvas.width / scale, canvas.height / scale];
};

/**
 * 初始化画布上下文
 * 重置画布的变换矩阵，应用缩放，并清空画布区域
 *
 * @param canvas - HTML画布元素
 * @param scale - 缩放比例，用于设置画布的缩放变换
 * @param normalizedWidth - 标准化后的画布宽度
 * @param normalizedHeight - 标准化后的画布高度
 * @returns 返回配置好的2D渲染上下文
 */
export const bootstrapCanvas = ({
  canvas,
  scale,
  normalizedWidth,
  normalizedHeight,
}: {
  canvas: HTMLCanvasElement;
  scale: number;
  normalizedWidth: number;
  normalizedHeight: number;
}): CanvasRenderingContext2D => {
  // 获取2D渲染上下文
  const context = canvas.getContext("2d")!;

  // 重置变换矩阵为单位矩阵（清除之前的变换）
  context.setTransform(1, 0, 0, 1, 0, 0);
  // 应用缩放变换
  context.scale(scale, scale);

  // 清空画布区域
  context.clearRect(0, 0, normalizedWidth, normalizedHeight);

  return context;
};
