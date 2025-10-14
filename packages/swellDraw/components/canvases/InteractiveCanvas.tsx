// 导入应用状态类型
import { InteractiveCanvasAppState } from "@swell-draw/swellDraw/types";
// 导入 React 相关类型和 hooks
import { DOMAttributes, useEffect, useRef } from "react";

/**
 * 交互式画布组件的属性类型定义
 */
type InteractiveCanvasProps = {
  // 容器引用，用于获取容器位置信息
  containerRef: React.RefObject<HTMLDivElement | null>;
  // 画布元素引用
  canvas: HTMLCanvasElement | null;
  // 应用状态
  appState: InteractiveCanvasAppState;
  // 缩放比例（通常为设备像素比）
  scale: number;
  // 画布引用处理函数
  handleCanvasRef: (canvas: HTMLCanvasElement | null) => void;
  // 指针按下事件处理函数
  onPointerDown: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerDown"],
    undefined
  >;
  // 指针抬起事件处理函数
  onPointerUp: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerUp"],
    undefined
  >;
  // 指针移动事件处理函数
  onPointerMove: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerMove"],
    undefined
  >;
  // 指针取消事件处理函数
  onPointerCancel: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerCancel"],
    undefined
  >;
};

/**
 * 交互式画布组件
 * 负责处理用户交互事件（鼠标、触摸、触控笔等）
 * 与静态画布配合使用，提供实时的交互反馈
 * @param props 组件属性
 * @returns JSX 元素
 */
const InteractiveCanvas = (props: InteractiveCanvasProps) => {
  // 用于跟踪组件是否已挂载的引用
  const isComponentMounted = useRef(false);

  // 组件挂载后的副作用处理
  useEffect(() => {
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;
      return;
    }
  });

  return (
    <canvas
      className="swell-draw-canvas interactive"
      ref={props.handleCanvasRef}
      style={{
        width: props.appState.width,
        height: props.appState.height,
      }}
      width={props.appState.width * props.scale}
      height={props.appState.height * props.scale}
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
      onPointerMove={props.onPointerMove}
      onPointerCancel={props.onPointerCancel}
    />
  );
};

export default InteractiveCanvas;
