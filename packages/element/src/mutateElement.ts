import {
  getUpdatedTimestamp,
  Mutable,
  randomInteger,
} from "@swell-draw/common";
import { ElementsMap, SwellDrawElement } from "./types";
import { ShapeCache } from "./shape";

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
  // options?: {
  //   isDragging?: boolean;
  // },
) => {
  let didChange = false;
  // 遍历所有更新属性并应用到元素上
  for (const key in updates) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (updates as any)[key];
    if (typeof value !== "undefined") {
      // 检查值是否真的发生了变化
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any)[key] === value &&
        // 如果是对象，总是更新，因为其属性可能已改变
        // (除了下面我们特殊处理的特定键)
        (typeof value !== "object" ||
          value === null ||
          key === "groupIds" ||
          key === "scale")
      ) {
        continue;
      }

      // 特殊处理缩放属性
      if (key === "scale") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prevScale = (element as any)[key];
        const nextScale = value;
        if (prevScale[0] === nextScale[0] && prevScale[1] === nextScale[1]) {
          continue;
        }
      }

      // 应用更新到元素
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any)[key] = value;
      didChange = true;
    }
  }

  // 如果没有发生任何变化，直接返回原元素
  if (!didChange) {
    return element;
  }

  if (
    typeof updates.height !== "undefined" ||
    typeof updates.width !== "undefined"
  ) {
    ShapeCache.delete(element);
  }

  // 更新元素的版本信息
  element.version = updates.version ?? element.version + 1;
  element.versionNonce = updates.versionNonce ?? randomInteger();
  element.updated = getUpdatedTimestamp();

  return element;
};
