import { Component, createRef } from "react";
import {
  AppClassProperties,
  AppProps,
  AppState,
  PointerDownState,
  ToolType,
} from "../types";
import StaticCanvas from "./canvases/StaticCanvas";
import rough from "roughjs/bin/rough";
import type { RoughCanvas } from "roughjs/bin/canvas";
import InteractiveCanvas from "./canvases/InteractiveCanvas";
import { EVENT, isIOS } from "@swell-draw/common";
import LayerUI from "./LayerUI/LayerUI";
import { SwellDrawContext } from "./AppContext";
import { nanoid } from "nanoid";
import { getDefaultAppState } from "./appState";
import { viewportCoordsToSceneCoords } from "../utils/dom";
import {
  newElement,
  Scene,
  SwellDrawGenericElement,
} from "@swell-draw/element";

class App extends Component<AppProps, AppState> {
  canvas: AppClassProperties["canvas"];
  interactiveCanvas: AppClassProperties["interactiveCanvas"] = null;
  rc: RoughCanvas;

  private swellDrawContainerRef = createRef<HTMLDivElement>();

  public scene: Scene;
  public id: string = "";
  public swellDrawContainerValue: {
    container: HTMLDivElement | null;
    id: string;
  };

  lastPointerDownEvent: React.PointerEvent<HTMLElement> | null = null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      ...getDefaultAppState(),
      ...this.getCanvasOffsets(),
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas = document.createElement("canvas");
    this.rc = rough.canvas(this.canvas);
    this.scene = new Scene();
    this.id = nanoid();
    this.swellDrawContainerValue = {
      container: this.swellDrawContainerRef.current,
      id: this.id,
    };
  }

  private getCanvasOffsets(): Pick<AppState, "offsetTop" | "offsetLeft"> {
    if (this.swellDrawContainerRef?.current) {
      const swellDrawContainer = this.swellDrawContainerRef.current;
      const { left, top } = swellDrawContainer.getBoundingClientRect();
      return {
        offsetLeft: left,
        offsetTop: top,
      };
    }
    return {
      offsetLeft: 0,
      offsetTop: 0,
    };
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

  private initialPointerDownState = (
    event: React.PointerEvent<HTMLElement>,
  ): PointerDownState => {
    const origin = viewportCoordsToSceneCoords(event, this.state);

    return {
      origin,
    };
  };

  /**
   * 处理鼠标/指针移动事件的核心方法
   * 当用户在画布上按下鼠标并移动时，此方法会被调用
   * 主要功能包括：
   * 1. 处理各种工具的拖拽操作（包括矩形工具）
   * 2. 处理元素的选择和移动
   * 3. 处理线性元素的编辑
   * 4. 处理框选操作
   *
   * @param pointerDownState 指针按下时的状态信息，包含起始坐标、拖拽状态等
   * @returns 返回一个节流处理的事件处理函数
   */
  private onPointerMoveFromPointerDownHandler(
    pointerDownState: PointerDownState,
  ) {
    console.log("onPointerMoveFromPointerDownHandler", pointerDownState);
    return (event: PointerEvent) => {
      // 将视口坐标转换为场景坐标
      const pointerCoords = viewportCoordsToSceneCoords(event, this.state);
      console.log("pointerCoords", pointerCoords);
      if (this.state.activeTool.type === "rectangle") {
        // 处理新建元素的拖拽操作（包括矩形工具）
        // const newElement = this.state.newElement;
        // if (!newElement) {
        //   return;
        // }
      }
    };
  }

  /**
   * 处理画布上的指针按下事件
   * 这是用户与画布交互的起始点，处理各种指针类型（鼠标、触摸、触控笔等）
   * @param event - React 指针事件对象
   */
  private handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    // 保存最后指针按下事件
    this.lastPointerDownEvent = event;

    // 指针交互期间的状态，从 pointerDown 事件开始，
    // 以 pointerUp 事件结束（或另一个 pointerDown）
    const pointerDownState = this.initialPointerDownState(event);

    if (
      this.state.activeTool.type === "rectangle" ||
      this.state.activeTool.type === "diamond" ||
      this.state.activeTool.type === "ellipse"
    ) {
      // 处理其他通用元素工具（矩形、椭圆、菱形等）
      this.createGenericElementOnPointerDown(
        this.state.activeTool.type,
        pointerDownState,
      );
    }

    // 创建指针移动事件处理器
    const onPointerMove =
      this.onPointerMoveFromPointerDownHandler(pointerDownState);

    window.addEventListener(EVENT.POINTER_MOVE, onPointerMove);
  };

  private createGenericElementOnPointerDown = (
    elementType: SwellDrawGenericElement["type"],
    pointerDownState: PointerDownState,
  ): void => {
    console.log(
      "createGenericElementOnPointerDown",
      elementType,
      pointerDownState,
    );

    // 构建基础元素属性，包含当前工具的样式设置
    const baseElementAttributes = {
      x: pointerDownState.origin.x,
      y: pointerDownState.origin.y,
      strokeColor: "#000", // 描边颜色
      backgroundColor: "transparent", // 背景颜色
      fillStyle: "solid", // 填充样式
      strokeWidth: 1, // 描边宽度
      strokeStyle: "solid", // 描边样式
      roughness: 1, // 粗糙度（手绘效果）
      opacity: 1, // 透明度
      roundness: 0, // 圆角设置
      locked: false, // 是否锁定
      frameId: null, // 所属框架ID
    } as const;

    console.log(baseElementAttributes);
    // 创建通用几何元素（矩形、椭圆、菱形等）
    const element = newElement({
      type: elementType,
      ...baseElementAttributes,
    });

    // 根据元素类型设置不同的状态
    if (element.type === "selection") {
      // 如果是选择框，设置为选择元素状态
    } else {
      // 对于其他元素，插入到场景中并设置为新元素
      this.scene.insertElement(element);
      this.setState({
        newElement: element, // 设置为当前正在创建的新元素
      });
    }
  };

  private handleCanvasPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    console.log("handleCanvasPointerUp", event);
  };

  private handleCanvasPointerMove = () => {};

  private handleCanvasPointerCancel = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    console.log("handleCanvasPointerCancel", event);
  };
  public setActiveTool = (
    tool: { type: ToolType } | { type: "custom"; customType: string },
  ) => {
    this.setState({
      activeTool: {
        type: tool.type,
        customType: tool.type === "custom" ? tool.customType : null,
      },
    });
  };

  public render() {
    return (
      <div ref={this.swellDrawContainerRef}>
        <SwellDrawContext.Provider value={this.swellDrawContainerValue}>
          <LayerUI appState={this.state} app={this} />
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
        </SwellDrawContext.Provider>
      </div>
    );
  }
}

export default App;
