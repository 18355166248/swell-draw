// React 相关导入
import { Component, createRef } from "react";
// 应用类型定义导入
import {
  AppClassProperties,
  AppProps,
  AppState,
  PointerDownState,
  ToolType,
} from "../types";
// 画布组件导入
import StaticCanvas from "./canvases/StaticCanvas";
// Rough.js 手绘风格渲染库导入
import rough from "roughjs/bin/rough";
import type { RoughCanvas } from "roughjs/bin/canvas";
import InteractiveCanvas from "./canvases/InteractiveCanvas";
// 通用工具和常量导入
import { distance, EVENT, isIOS, tupleToCoors } from "@swell-draw/common";
// UI 组件导入
import LayerUI from "./LayerUI/LayerUI";
import { SwellDrawContext } from "./AppContext";
// 工具函数导入
import { nanoid } from "nanoid";
import { getDefaultAppState } from "./appState";
import { viewportCoordsToSceneCoords } from "../utils/dom";
// 元素和场景管理导入
import {
  dragNewElement,
  newElement,
  Scene,
  SwellDrawGenericElement,
} from "@swell-draw/element";

/**
 * SwellDraw 主应用组件
 * 负责管理整个绘图应用的状态、画布渲染和用户交互
 * 支持多种绘图工具（矩形、椭圆、菱形等）和手绘风格渲染
 */
class App extends Component<AppProps, AppState> {
  // 静态画布引用，用于渲染已完成的图形元素
  canvas: AppClassProperties["canvas"];
  // 交互式画布引用，用于处理用户交互和临时绘制
  interactiveCanvas: AppClassProperties["interactiveCanvas"] = null;
  // Rough.js 画布实例，用于生成手绘风格的图形
  rc: RoughCanvas;

  // SwellDraw 容器的 React ref，用于获取容器位置信息
  private swellDrawContainerRef = createRef<HTMLDivElement>();

  // 场景管理器，存储和管理所有图形元素
  public scene: Scene;
  // 应用实例的唯一标识符
  public id: string = "";
  // 容器上下文值，包含容器引用和 ID
  public swellDrawContainerValue: {
    container: HTMLDivElement | null;
    id: string;
  };

  // 最后记录的指针按下事件，用于处理拖拽等交互
  lastPointerDownEvent: React.PointerEvent<HTMLElement> | null = null;

  /**
   * 构造函数 - 初始化应用组件
   * @param props 组件属性
   */
  constructor(props: AppProps) {
    super(props);
    // 初始化应用状态，包含默认状态、画布偏移量和窗口尺寸
    this.state = {
      ...getDefaultAppState(),
      ...this.getCanvasOffsets(),
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // 创建静态画布元素
    this.canvas = document.createElement("canvas");
    // 初始化 Rough.js 画布实例，用于手绘风格渲染
    this.rc = rough.canvas(this.canvas);
    // 创建场景管理器实例
    this.scene = new Scene();
    // 生成唯一的应用实例 ID
    this.id = nanoid();
    // 初始化容器上下文值
    this.swellDrawContainerValue = {
      container: this.swellDrawContainerRef.current,
      id: this.id,
    };
  }

  /**
   * 获取画布相对于视口的偏移量
   * 用于坐标转换，将视口坐标转换为场景坐标
   * @returns 包含 offsetLeft 和 offsetTop 的对象
   */
  private getCanvasOffsets(): Pick<AppState, "offsetTop" | "offsetLeft"> {
    if (this.swellDrawContainerRef?.current) {
      const swellDrawContainer = this.swellDrawContainerRef.current;
      // 获取容器相对于视口的位置
      const { left, top } = swellDrawContainer.getBoundingClientRect();
      return {
        offsetLeft: left,
        offsetTop: top,
      };
    }
    // 如果容器不存在，返回默认偏移量
    return {
      offsetLeft: 0,
      offsetTop: 0,
    };
  }

  /**
   * 处理交互式画布引用的回调函数
   * 当画布组件挂载或卸载时调用，用于注册和清理触摸事件监听器
   * @param canvas 画布元素引用，为 null 时表示组件卸载
   */
  private handleInteractiveCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas !== null) {
      // 保存画布引用
      this.interactiveCanvas = canvas;

      // -----------------------------------------------------------------------
      // 注意：wheel、touchstart、touchend 事件必须在 React 外部注册
      // 因为 React 以被动模式绑定它们（所以我们无法阻止它们的默认行为）
      // 注册触摸开始事件监听器，设置为非被动模式以允许阻止默认行为
      this.interactiveCanvas.addEventListener(
        EVENT.TOUCH_START,
        this.onTouchStart,
        { passive: false },
      );
      // 注册触摸结束事件监听器
      this.interactiveCanvas.addEventListener(EVENT.TOUCH_END, this.onTouchEnd);
      // -----------------------------------------------------------------------
    } else {
      // 组件卸载时，清理事件监听器
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

  /**
   * 处理触摸开始事件
   * 主要用于修复 iOS 设备上 Apple Pencil Scribble 功能的问题
   * @param event 触摸事件对象
   */
  private onTouchStart = (event: TouchEvent) => {
    // 修复 Apple Pencil Scribble 问题（不对其他设备进行阻止）
    if (isIOS) {
      event.preventDefault();
    }

    console.log("onTouchStart", event);
  };

  /**
   * 处理触摸结束事件
   * @param event 触摸事件对象
   */
  private onTouchEnd = (event: TouchEvent) => {
    console.log("onTouchEnd", event);
  };

  /**
   * 初始化指针按下时的状态
   * 将视口坐标转换为场景坐标，为后续的拖拽操作做准备
   * @param event React 指针事件对象
   * @returns 包含起始坐标的指针状态对象
   */
  private initialPointerDownState = (
    event: React.PointerEvent<HTMLElement>,
  ): PointerDownState => {
    // 将视口坐标转换为场景坐标
    const origin = viewportCoordsToSceneCoords(event, this.state);

    return {
      origin,
      originInGrid: tupleToCoors([origin.x, origin.y]),
      eventListeners: {
        onMove: null,
        onUp: null,
      },
      lastCoords: { x: 0, y: 0 },
    };
  };

  /**
   * 创建指针移动事件处理器
   * 当用户在画布上按下鼠标并移动时，此方法会被调用
   * 主要功能包括：
   * 1. 处理各种工具的拖拽操作（包括矩形工具）
   * 2. 处理元素的选择和移动
   * 3. 处理线性元素的编辑
   * 4. 处理框选操作
   *
   * @param pointerDownState 指针按下时的状态信息，包含起始坐标、拖拽状态等
   * @returns 返回一个处理指针移动事件的函数
   */
  private onPointerMoveFromPointerDownHandler(
    pointerDownState: PointerDownState,
  ) {
    console.log("onPointerMoveFromPointerDownHandler", pointerDownState);
    return (event: PointerEvent) => {
      // 将视口坐标转换为场景坐标
      const pointerCoords = viewportCoordsToSceneCoords(event, this.state);
      console.log("pointerCoords", pointerCoords);

      // 根据当前激活的工具类型处理不同的拖拽操作
      if (this.state.activeTool.type === "rectangle") {
        // 处理矩形工具的拖拽操作
        // TODO: 实现矩形拖拽时的实时预览
        const newElement = this.state.newElement;
        if (!newElement) {
          return;
        }
        if (newElement.type === "rectangle") {
          // 处理通用元素（矩形、椭圆、菱形等）的拖拽
          // 更新最后坐标
          pointerDownState.lastCoords.x = pointerCoords.x;
          pointerDownState.lastCoords.y = pointerCoords.y;
          // 调用通用元素拖拽方法，这里包含矩形工具的具体实现
          this.maybeDragNewGenericElement(pointerDownState, event);
        }
      }
    };
  }

  /**
   * 处理新建通用元素的拖拽操作
   * 这是矩形、椭圆、菱形等工具的核心拖拽逻辑
   *
   * @param pointerDownState 指针按下时的状态
   * @param event 鼠标或键盘事件
   * @param informMutation 是否通知变更
   */
  private maybeDragNewGenericElement = (
    pointerDownState: PointerDownState,
    event: MouseEvent | KeyboardEvent,
  ): void => {
    console.log("maybeDragNewGenericElement", event);
    const pointerCoords = pointerDownState.lastCoords;

    // 获取当前正在创建的新元素
    const newElement = this.state.newElement;
    if (!newElement) {
      return;
    }
    // 获取网格对齐的坐标
    const [gridX, gridY] = [pointerCoords.x, pointerCoords.y];

    // 调用dragNewElement函数执行实际的元素拖拽操作
    // 这里包含矩形工具的具体实现逻辑
    dragNewElement({
      newElement,
      originX: pointerDownState.originInGrid.x, // 起始X坐标
      originY: pointerDownState.originInGrid.y, // 起始Y坐标
      x: gridX, // 当前X坐标
      y: gridY, // 当前Y坐标
      width: distance(pointerDownState.originInGrid.x, gridX), // 计算宽度
      height: distance(pointerDownState.originInGrid.y, gridY), // 计算高度
      zoom: this.state.zoom.value, // 缩放值
      scene: this.scene, // 场景对象
    });

    // 更新新元素状态
    this.setState({
      newElement,
    });
  };

  /**
   * 处理指针抬起事件
   * @param pointerDownState 指针按下时的状态信息
   * @returns 返回一个处理指针抬起事件的函数
   */
  private onPointerUpFromPointerDownHandler(
    pointerDownState: PointerDownState,
  ) {
    return (event: PointerEvent) => {
      console.log("onPointerUpFromPointerDownHandler", event, pointerDownState);

      window.removeEventListener(
        EVENT.POINTER_MOVE,
        pointerDownState.eventListeners.onMove!,
      );
      window.removeEventListener(
        EVENT.POINTER_UP,
        pointerDownState.eventListeners.onUp!,
      );
    };
  }

  /**
   * 处理画布上的指针按下事件
   * 这是用户与画布交互的起始点，处理各种指针类型（鼠标、触摸、触控笔等）
   * @param event React 指针事件对象
   */
  private handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    // 保存最后指针按下事件，用于后续处理
    this.lastPointerDownEvent = event;

    // 指针交互期间的状态，从 pointerDown 事件开始，
    // 以 pointerUp 事件结束（或另一个 pointerDown）
    const pointerDownState = this.initialPointerDownState(event);

    // 根据当前激活的工具类型处理不同的交互
    if (
      this.state.activeTool.type === "rectangle" ||
      this.state.activeTool.type === "diamond" ||
      this.state.activeTool.type === "ellipse"
    ) {
      // 处理几何图形工具（矩形、椭圆、菱形等）
      this.createGenericElementOnPointerDown(
        this.state.activeTool.type,
        pointerDownState,
      );
    }

    // 创建指针移动事件处理器，用于处理拖拽操作
    const onPointerMove =
      this.onPointerMoveFromPointerDownHandler(pointerDownState);

    // 创建指针抬起事件处理器，用于处理拖拽操作
    const onPointerUp =
      this.onPointerUpFromPointerDownHandler(pointerDownState);

    // 在全局窗口上注册指针移动事件监听器
    window.addEventListener(EVENT.POINTER_MOVE, onPointerMove);
    window.addEventListener(EVENT.POINTER_UP, onPointerUp);

    // 将事件监听器保存到指针状态中，以便后续清理
    pointerDownState.eventListeners.onMove = onPointerMove;
    pointerDownState.eventListeners.onUp = onPointerUp;
    console.log(23344, pointerDownState.eventListeners);
  };

  /**
   * 在指针按下时创建通用几何元素
   * 处理矩形、椭圆、菱形等几何图形的创建逻辑
   * @param elementType 要创建的元素类型
   * @param pointerDownState 指针按下时的状态信息
   */
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
      x: pointerDownState.origin.x, // 元素起始 X 坐标
      y: pointerDownState.origin.y, // 元素起始 Y 坐标
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
      // TODO: 实现选择框的特殊处理逻辑
    } else {
      // 对于其他元素，插入到场景中并设置为新元素
      this.scene.insertElement(element);
      this.setState({
        newElement: element, // 设置为当前正在创建的新元素
      });
    }
  };

  /**
   * 处理画布上的指针抬起事件
   * 通常用于完成拖拽操作或结束元素创建
   * @param event React 指针事件对象
   */
  private handleCanvasPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    console.log("handleCanvasPointerUp", event);
  };

  /**
   * 处理画布上的指针移动事件
   * 目前为空实现，具体逻辑在 onPointerMoveFromPointerDownHandler 中处理
   */
  private handleCanvasPointerMove = () => {};

  /**
   * 处理画布上的指针取消事件
   * 当指针事件被系统取消时调用（如系统手势冲突）
   * @param event React 指针事件对象
   */
  private handleCanvasPointerCancel = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    console.log("handleCanvasPointerCancel", event);
  };

  /**
   * 设置当前激活的绘图工具
   * @param tool 工具配置对象，可以是标准工具或自定义工具
   */
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

  /**
   * 渲染应用组件
   * 返回包含图层UI、静态画布和交互式画布的完整界面
   * @returns JSX 元素
   */
  public render() {
    return (
      <div ref={this.swellDrawContainerRef}>
        {/* 提供 SwellDraw 上下文，包含容器引用和 ID */}
        <SwellDrawContext.Provider value={this.swellDrawContainerValue}>
          {/* 图层UI组件，显示工具面板和图层管理 */}
          <LayerUI appState={this.state} app={this} />
          {/* 静态画布，用于渲染已完成的图形元素 */}
          <StaticCanvas
            canvas={this.canvas}
            appState={this.state}
            scale={window.devicePixelRatio}
          />
          {/* 交互式画布，用于处理用户交互和临时绘制 */}
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
