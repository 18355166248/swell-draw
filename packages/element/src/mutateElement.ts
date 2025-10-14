import { Mutable } from "@swell-draw/common";
import { ElementsMap, SwellDrawElement } from "./types";

export type ElementUpdate<TElement extends SwellDrawElement> = Omit<
  Partial<TElement>,
  "id" | "updated"
>;

/**
 * 此函数用于跟踪文本元素的更新，目的是为了协作功能
 * 版本号用于在多个用户在同一绘图上工作时比较更新
 *
 * 警告：此函数不会触发组件更新，如果需要触发组件更新，
 * 请使用 `scene.mutateElement` 或 `ExcalidrawImperativeAPI.mutateElement` 替代
 *
 * @param element 要修改的元素
 * @param elementsMap 元素映射表
 * @param updates 要应用的更新数据
 * @param options 配置选项
 * @param options.isDragging 是否正在拖拽
 * @returns 修改后的元素
 */
export const mutateElement = <TElement extends Mutable<SwellDrawElement>>(
  element: TElement,
  elementsMap: ElementsMap,
  updates: ElementUpdate<TElement>,
  options?: {
    isDragging?: boolean;
  },
) => {
  console.log("mutateElement", element, elementsMap, updates, options);
};
