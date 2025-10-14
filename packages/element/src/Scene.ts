import {
  NonDeleted,
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
  Ordered,
  OrderedSwellDrawElement,
  SwellDrawElement,
} from "@swell-draw/element/types";
import { Mutable, toArray, toBrandedType } from "@swell-draw/common";
import { ElementUpdate } from "./mutateElement";

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
  private elements: readonly OrderedSwellDrawElement[] = [];
  private nonDeletedElements: readonly Ordered<NonDeletedSwellDrawElement>[] =
    [];
  private nonDeletedElementsMap = toBrandedType<NonDeletedSceneElementsMap>(
    new Map(),
  );

  getNonDeletedElementsMap() {
    return this.nonDeletedElementsMap;
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
    options: {
      isDragging: boolean;
    } = {
      isDragging: false,
    },
  ) {
    console.log("mutateElement", options);
    return element;
  }
}
