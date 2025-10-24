import {
  NonDeletedSwellDrawElement,
  Scene,
  SwellDrawElement,
} from "@swell-draw/element";
import { memoize, toBrandedType } from "@swell-draw/common";
import { RenderableElementsMap } from "../types";

/**
 * 渲染器类 - 负责管理 Excalidraw 画布元素的渲染
 * 主要功能包括：
 * 1. 获取可见的可渲染元素
 * 2. 过滤掉正在编辑的文本元素
 * 3. 管理渲染缓存和性能优化
 */
export class Renderer {
  /** 场景对象，包含所有画布元素 */
  private scene: Scene;

  /**
   * 构造函数
   * @param scene 场景对象
   */
  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * 获取可渲染元素的方法（使用闭包和缓存优化）
   * 返回一个经过缓存的函数，用于获取当前视口内可见的可渲染元素
   */
  public getRenderableElements = (() => {
    /**
     * 获取画布中可见的元素
     * @param elementsMap 所有非删除元素的映射
     * @returns 可见元素数组
     */
    const getVisibleCanvasElements = ({
      elementsMap,
    }: {
      elementsMap: RenderableElementsMap;
    }): readonly NonDeletedSwellDrawElement[] => {
      const visibleElements: NonDeletedSwellDrawElement[] = [];

      // 遍历所有元素，检查是否在视口内
      for (const element of elementsMap.values()) {
        visibleElements.push(element);
      }
      return visibleElements;
    };

    /**
     * 获取可渲染的元素映射
     * 过滤掉正在编辑的文本元素和新创建的元素
     * @param elements 所有非删除元素数组
     * @param editingTextElement 当前正在编辑的文本元素
     * @param newElementId 新创建元素的ID
     * @returns 可渲染元素的映射表
     */
    const getRenderableElements = ({
      elements,
      newElementId,
    }: {
      elements: readonly NonDeletedSwellDrawElement[];
      newElementId: SwellDrawElement["id"] | undefined;
    }) => {
      const elementsMap = toBrandedType<RenderableElementsMap>(new Map());

      for (const element of elements) {
        // 跳过新创建的元素（避免重复渲染）
        if (newElementId === element.id) {
          continue;
        }

        elementsMap.set(element.id, element);
      }
      return elementsMap;
    };

    // 使用 memoize 缓存函数，提高渲染性能
    return memoize(
      ({
        newElementId,
      }: {
        /** 注意：新元素的首次渲染总是会破坏缓存
         * （我们必须在函数外部预过滤元素） */
        newElementId: SwellDrawElement["id"] | undefined;
      }) => {
        // 获取场景中所有未删除的元素
        const elements = this.scene.getNonDeletedElements();

        // 获取可渲染的元素映射
        const elementsMap = getRenderableElements({ elements, newElementId });

        // 获取当前视口内可见的元素
        const visibleElements = getVisibleCanvasElements({
          elementsMap,
        });

        return { elementsMap, visibleElements };
      },
    );
  })();

  /**
   * 销毁渲染器
   * 注意：不会销毁所有内容（场景、渲染上下文等），因为在这里破坏 TypeScript 契约
   * 可能不安全（对于上游用例）
   */
  public destroy() {
    // 清空可渲染元素的缓存
    this.getRenderableElements.clear();
  }
}
