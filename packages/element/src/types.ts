export type FillStyle = "hachure" | "cross-hatch" | "solid" | "zigzag";
export type StrokeStyle = "solid" | "dashed" | "dotted";

export type FractionalIndex = string;
export type GroupId = string;

type _SwellDrawElementBase = Readonly<{
  id: string;
  x: number;
  y: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  roughness: number;
  opacity: number;
  width: number;
  height: number;
  /** Random integer used to seed shape generation so that the roughjs shape
      doesn't differ across renders. */
  seed: number;
  /** Integer that is sequentially incremented on each change. Used to reconcile
      elements during collaboration or when saving to server. */
  version: number;
  /** Random integer that is regenerated on each change.
      Used for deterministic reconciliation of updates during collaboration,
      in case the versions (see above) are identical. */
  versionNonce: number;
  /** String in a fractional form defined by https://github.com/rocicorp/fractional-indexing.
      Used for ordering in multiplayer scenarios, such as during reconciliation or undo / redo.
      Always kept in sync with the array order by `syncMovedIndices` and `syncInvalidIndices`.
      Could be null, i.e. for new elements which were not yet assigned to the scene. */
  index: FractionalIndex | null;
  isDeleted: boolean;
  /** List of groups the element belongs to.
      Ordered from deepest to shallowest. */
  groupIds: readonly GroupId[];
  frameId: string | null;
  /** epoch (ms) timestamp of last element update */
  updated: number;
  link: string | null;
  locked: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customData?: Record<string, any>;
}>;

export type SwellDrawSelectionElement = _SwellDrawElementBase & {
  type: "selection";
};

export type SwellDrawRectangleElement = _SwellDrawElementBase & {
  type: "rectangle";
};

export type SwellDrawDiamondElement = _SwellDrawElementBase & {
  type: "diamond";
};

export type SwellDrawEllipseElement = _SwellDrawElementBase & {
  type: "ellipse";
};

/**
 * These are elements that don't have any additional properties.
 */
export type SwellDrawElement =
  | SwellDrawSelectionElement
  | SwellDrawRectangleElement
  | SwellDrawDiamondElement
  | SwellDrawEllipseElement;

export type Ordered<TElement extends SwellDrawElement> = TElement & {
  index: FractionalIndex;
};

export type OrderedSwellDrawElement = Ordered<SwellDrawElement>;

export type SwellDrawNonSelectionElement = Exclude<
  SwellDrawElement,
  SwellDrawSelectionElement
>;

export type NonDeleted<TElement extends SwellDrawElement> = TElement & {
  isDeleted: boolean;
};
