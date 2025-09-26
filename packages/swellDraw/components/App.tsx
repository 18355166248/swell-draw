import { Component, createRef } from "react";
import { AppClassProperties, AppProps, AppState } from "../types";
import StaticCanvas from "./canvases/StaticCanvas";
import rough from "roughjs/bin/rough";
import type { RoughCanvas } from "roughjs/bin/canvas";
import InteractiveCanvas from "./canvases/InteractiveCanvas";
import { EVENT, isIOS } from "@swell-draw/common";

class App extends Component<AppProps, AppState> {
  canvas: AppClassProperties["canvas"];
  interactiveCanvas: AppClassProperties["interactiveCanvas"] = null;
  rc: RoughCanvas;

  private swellDrawContainerRef = createRef<HTMLDivElement>();

  constructor(props: AppProps) {
    super(props);
    this.state = {
      isLoading: true,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas = document.createElement("canvas");
    this.rc = rough.canvas(this.canvas);
  }

  private handleInteractiveCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas !== null) {
      this.interactiveCanvas = canvas;

      // -----------------------------------------------------------------------
      // 注意：wheel、touchstart、touchend 事件必须在 React 外部注册
      // 因为 React 以被动模式绑定它们（所以我们无法阻止它们的默认行为）
      this.interactiveCanvas.addEventListener(
        EVENT.TOUCH_START,
        this.onTouchStart,
        { passive: false },
      );
      this.interactiveCanvas.addEventListener(EVENT.TOUCH_END, this.onTouchEnd);
      // -----------------------------------------------------------------------
    } else {
      this.interactiveCanvas?.removeEventListener(
        EVENT.TOUCH_START,
        this.onTouchStart,
      );
      this.interactiveCanvas?.removeEventListener(
        EVENT.TOUCH_END,
        this.onTouchEnd,
      );
    }
  };

  private onTouchStart = (event: TouchEvent) => {
    // 修复 Apple Pencil Scribble 问题（不对其他设备进行阻止）
    if (isIOS) {
      event.preventDefault();
    }

    console.log("onTouchStart", event);
  };

  private onTouchEnd = (event: TouchEvent) => {
    console.log("onTouchEnd", event);
  };

  /**
   * 处理画布上的指针按下事件
   * 这是用户与画布交互的起始点，处理各种指针类型（鼠标、触摸、触控笔等）
   * @param event - React 指针事件对象
   */
  private handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    console.log("handleCanvasPointerDown", event);
  };

  private handleCanvasPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    console.log("handleCanvasPointerUp", event);
  };

  private handleCanvasPointerMove = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    console.log("handleCanvasPointerMove", event);
  };

  private handleCanvasPointerCancel = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    console.log("handleCanvasPointerCancel", event);
  };

  public render() {
    return (
      <div>
        <StaticCanvas
          canvas={this.canvas}
          appState={this.state}
          scale={window.devicePixelRatio}
        />
        <InteractiveCanvas
          containerRef={this.swellDrawContainerRef}
          canvas={this.interactiveCanvas}
          appState={this.state}
          scale={window.devicePixelRatio}
          handleCanvasRef={this.handleInteractiveCanvasRef}
          onPointerDown={this.handleCanvasPointerDown}
          onPointerUp={this.handleCanvasPointerUp}
          onPointerMove={this.handleCanvasPointerMove}
          onPointerCancel={this.handleCanvasPointerCancel}
        />
      </div>
    );
  }
}

export default App;
