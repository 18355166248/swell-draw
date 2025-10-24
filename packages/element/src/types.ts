import { MakeBrand } from "@swell-draw/common";

// 填充样式类型定义
export type FillStyle = "hachure" | "cross-hatch" | "solid" | "zigzag";
// 描边样式类型定义
export type StrokeStyle = "solid" | "dashed" | "dotted";

// 分数索引类型，用于元素排序
export type FractionalIndex = string;
// 组ID类型，用于元素分组
export type GroupId = string;

/**
 * SwellDraw 元素的基础类型定义
 * 包含所有图形元素的通用属性
 */
type _SwellDrawElementBase = Readonly<{
  // 元素唯一标识符
  id: string;
  // 元素在场景中的 X 坐标
  x: number;
  // 元素在场景中的 Y 坐标
  y: number;
  // 描边颜色
  strokeColor: string;
  // 背景颜色
  backgroundColor: string;
  // 填充样式
  fillStyle: FillStyle;
  // 描边宽度
  strokeWidth: number;
  // 描边样式
  strokeStyle: StrokeStyle;
  // 粗糙度（手绘效果强度）
  roughness: number;
  // 透明度（0-1）
  opacity: number;
  // 元素宽度
  width: number;
  // 元素高度
  height: number;
  /** 随机整数，用于种子形状生成，确保 roughjs 形状在不同渲染中保持一致 */
  seed: number;
  /** 整数，每次更改时顺序递增。用于协作或保存到服务器时协调元素 */
  version: number;
  /** 随机整数，每次更改时重新生成。
      用于协作期间确定性协调更新，以防版本（见上文）相同 */
  versionNonce: number;
  /** 分数形式的字符串，定义在 https://github.com/rocicorp/fractional-indexing。
      用于多人场景中的排序，如协调或撤销/重做期间。
      通过 `syncMovedIndices` 和 `syncInvalidIndices` 与数组顺序保持同步。
      可能为 null，即对于尚未分配到场景的新元素 */
  index: FractionalIndex | null;
  // 元素是否已删除
  isDeleted: boolean;
  /** 元素所属的组列表。
      按从最深到最浅的顺序排列 */
  groupIds: readonly GroupId[];
  // 所属框架ID
  frameId: string | null;
  /** 最后元素更新的时间戳（毫秒） */
  updated: number;
  // 链接地址
  link: string | null;
  // 是否锁定
  locked: boolean;
  // 自定义数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customData?: Record<string, any>;
}>;

// 选择框元素类型
export type SwellDrawSelectionElement = _SwellDrawElementBase & {
  type: "selection";
};

// 矩形元素类型
export type SwellDrawRectangleElement = _SwellDrawElementBase & {
  type: "rectangle";
};

// 菱形元素类型
export type SwellDrawDiamondElement = _SwellDrawElementBase & {
  type: "diamond";
};

// 椭圆元素类型
export type SwellDrawEllipseElement = _SwellDrawElementBase & {
  type: "ellipse";
};

// 通用图形元素联合类型
export type SwellDrawGenericElement =
  | SwellDrawSelectionElement
  | SwellDrawRectangleElement
  | SwellDrawDiamondElement
  | SwellDrawEllipseElement;

/**
 * 这些元素没有额外的属性
 * 所有 SwellDraw 元素的通用类型
 */
export type SwellDrawElement = SwellDrawGenericElement;

// 有序元素类型，确保有有效的索引
export type Ordered<TElement extends SwellDrawElement> = TElement & {
  index: FractionalIndex;
};

// 有序的 SwellDraw 元素类型
export type OrderedSwellDrawElement = Ordered<SwellDrawElement>;

// 非选择元素类型（排除选择框）
export type SwellDrawNonSelectionElement = Exclude<
  SwellDrawElement,
  SwellDrawSelectionElement
>;

// 非删除元素类型，确保 isDeleted 为 false
export type NonDeleted<TElement extends SwellDrawElement> = TElement & {
  isDeleted: boolean;
};

export type NonDeletedSwellDrawElement = NonDeleted<SwellDrawElement>;

/**
 * Map of non-deleted elements.
 * Can be a subset of Scene elements.
 */
export type NonDeletedElementsMap = Map<
  SwellDrawElement["id"],
  NonDeletedSwellDrawElement
> &
  MakeBrand<"NonDeletedSwellDrawElementsMap">;

/**
 * Map of all non-deleted Scene elements.
 * Not a subset. Use this type when you need access to current Scene elements.
 */
export type NonDeletedSceneElementsMap = Map<
  SwellDrawElement["id"],
  Ordered<NonDeletedSwellDrawElement>
> &
  MakeBrand<"NonDeletedSwellDrawElementsMap">;

/**
 * Map of excalidraw elements.
 * Unspecified whether deleted or non-deleted.
 * Can be a subset of Scene elements.
 */
export type ElementsMap = Map<SwellDrawElement["id"], SwellDrawElement>;
