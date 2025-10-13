import {
  DEFAULT_ELEMENT_PROPS,
  getUpdatedTimestamp,
  MarkOptional,
  Merge,
  randomId,
  randomInteger,
} from "@swell-draw/common";
import { NonDeleted, SwellDrawElement, SwellDrawGenericElement } from "./types";

export type ElementConstructorOpts = MarkOptional<
  Omit<SwellDrawGenericElement, "id" | "type" | "isDeleted" | "updated">,
  | "width"
  | "height"
  | "groupIds"
  | "frameId"
  | "index"
  | "seed"
  | "version"
  | "versionNonce"
  | "link"
  | "strokeStyle"
  | "fillStyle"
  | "strokeColor"
  | "backgroundColor"
  | "roughness"
  | "strokeWidth"
  | "locked"
  | "opacity"
  | "customData"
>;

export const newElement = (
  opts: {
    type: SwellDrawGenericElement["type"];
  } & ElementConstructorOpts,
): NonDeleted<SwellDrawGenericElement> =>
  _newElementBase<SwellDrawGenericElement>(opts.type, opts);

const _newElementBase = <T extends SwellDrawElement>(
  type: T["type"],
  {
    x,
    y,
    strokeColor = DEFAULT_ELEMENT_PROPS.strokeColor,
    backgroundColor = DEFAULT_ELEMENT_PROPS.backgroundColor,
    fillStyle = DEFAULT_ELEMENT_PROPS.fillStyle,
    strokeWidth = DEFAULT_ELEMENT_PROPS.strokeWidth,
    strokeStyle = DEFAULT_ELEMENT_PROPS.strokeStyle,
    roughness = DEFAULT_ELEMENT_PROPS.roughness,
    opacity = DEFAULT_ELEMENT_PROPS.opacity,
    width = 0,
    height = 0,
    groupIds = [],
    frameId = null,
    index = null,
    link = null,
    locked = false,
    ...rest
  }: ElementConstructorOpts & Omit<Partial<SwellDrawGenericElement>, "type">,
) => {
  const element: Merge<SwellDrawGenericElement, { type: T["type"] }> = {
    id: rest.id || randomId(),
    type,
    x,
    y,
    width,
    height,
    strokeColor,
    backgroundColor,
    fillStyle,
    strokeWidth,
    strokeStyle,
    roughness,
    opacity,
    groupIds,
    frameId,
    index,
    seed: rest.seed ?? randomInteger(),
    version: rest.version || 1,
    versionNonce: rest.versionNonce ?? 0,
    isDeleted: false as const,
    updated: getUpdatedTimestamp(),
    link,
    locked,
    customData: rest.customData,
  };
  return element;
};
