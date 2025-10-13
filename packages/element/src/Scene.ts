import { OrderedSwellDrawElement, SwellDrawElement } from "@swell-draw/element/types";
import { toArray } from "@swell-draw/common";

export class Scene {
  private elements: readonly OrderedSwellDrawElement[] = [];

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

  replaceAllElements (
    nextElements: SwellDrawElement[],

  ) {
    // we do trust the insertion order on the map, though maybe we shouldn't and should prefer order defined by fractional indices
    const _nextElements = toArray(nextElements);

    this.elements = _nextElements;
  }

  getElementIndex(elementId: string) {
    return this.elements.findIndex((element) => element.id === elementId);
  }
}
