import {
  NonDeleted,
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
  Ordered,
  OrderedSwellDrawElement,
  SwellDrawElement,
} from "@swell-draw/element/types";
import {
  Mutable,
  randomInteger,
  toArray,
  toBrandedType,
} from "@swell-draw/common";
import { ElementUpdate, mutateElement } from "./mutateElement";

type SceneStateCallback = () => void;
type SceneStateCallbackRemover = () => void;

const getNonDeletedElements = <T extends SwellDrawElement>(
  allElements: readonly T[],
) => {
  const elementsMap = new Map() as NonDeletedSceneElementsMap;
  const elements: T[] = [];
  for (const element of allElements) {
    if (!element.isDeleted) {
      elements.push(element as NonDeleted<T>);
      elementsMap.set(
        element.id,
        element as Ordered<NonDeletedSwellDrawElement>,
      );
    }
  }
  return { elementsMap, elements };
};

export class Scene {
  private callbacks: Set<SceneStateCallback> = new Set();

  private elements: readonly OrderedSwellDrawElement[] = [];
  private nonDeletedElements: readonly Ordered<NonDeletedSwellDrawElement>[] =
    [];
  private nonDeletedElementsMap = toBrandedType<NonDeletedSceneElementsMap>(
    new Map(),
  );
  /**
   * 每次场景更新时重新生成的随机整数。
   *
   * 与元素版本无关，目前仅用于渲染器缓存失效的随机数。
   */
  private sceneNonce: number | undefined;

  getSceneNonce() {
    return this.sceneNonce;
  }

  getNonDeletedElementsMap() {
    return this.nonDeletedElementsMap;
  }

  getElementsIncludingDeleted() {
    return this.elements;
  }

  getNonDeletedElements() {
    return this.nonDeletedElements;
  }

  insertElement = (element: SwellDrawElement) => {
    const index = element.frameId
      ? this.getElementIndex(element.frameId)
      : this.elements.length;

    this.insertElementAtIndex(element, index);
  };

  insertElementAtIndex(element: SwellDrawElement, index: number) {
    if (!Number.isFinite(index) || index < 0) {
      throw new Error(
        "insertElementAtIndex can only be called with index >= 0",
      );
    }

    const nextElements = [
      ...this.elements.slice(0, index),
      element,
      ...this.elements.slice(index),
    ];

    this.replaceAllElements(nextElements);
  }

  replaceAllElements(nextElements: SwellDrawElement[]) {
    // we do trust the insertion order on the map, though maybe we shouldn't and should prefer order defined by fractional indices
    const _nextElements = toArray(nextElements);

    this.elements = _nextElements;
    const nonDeletedElements = getNonDeletedElements(this.elements);
    this.nonDeletedElements = nonDeletedElements.elements;
    this.nonDeletedElementsMap = nonDeletedElements.elementsMap;
  }

  getElementIndex(elementId: string) {
    return this.elements.findIndex((element) => element.id === elementId);
  }

  onUpdate(cb: SceneStateCallback): SceneStateCallbackRemover {
    if (this.callbacks.has(cb)) {
      throw new Error();
    }

    this.callbacks.add(cb);

    return () => {
      if (!this.callbacks.has(cb)) {
        throw new Error();
      }
      this.callbacks.delete(cb);
    };
  }

  destroy() {
    this.elements = [];
    this.nonDeletedElements = [];

    this.callbacks.clear();
  }

  triggerUpdate() {
    this.sceneNonce = randomInteger();

    for (const callback of Array.from(this.callbacks)) {
      callback();
    }
  }

  /**
   * 使用传入的更新数据修改元素并触发组件更新
   * 请确保在 React 事件处理器中调用此方法，或在 unstable_batchedUpdates() 内部调用
   *
   * @param element 要修改的元素
   * @param updates 要应用的更新数据
   * @param options 配置选项
   * @param options.isDragging 是否正在拖拽
   * @returns 修改后的元素
   */
  mutateElement<TElement extends Mutable<SwellDrawElement>>(
    element: TElement,
    updates: ElementUpdate<TElement>,
  ) {
    // 记录修改前的版本号
    const { version: prevVersion } = element;
    // 获取场景中所有未删除元素的映射表
    const elementsMap = this.getNonDeletedElementsMap();

    const { version: nextVersion } = mutateElement(
      element,
      elementsMap,
      updates,
    );

    // 检查是否需要触发场景更新
    if (prevVersion !== nextVersion) {
      this.triggerUpdate();
    }

    return element;
  }
}
