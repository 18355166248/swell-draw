import { throttleRAF } from "@swell-draw/common";
import { NewElementSceneRenderConfig } from "../scene/types";

const _renderNewElementScene = ({
  canvas,
  rc,
  newElement,
  elementsMap,
  allElementsMap,
  scale,
  appState,
}: NewElementSceneRenderConfig) => {
  if (canvas) {
    console.log(
      "renderNewElementScene",
      canvas,
      rc,
      newElement,
      elementsMap,
      allElementsMap,
      scale,
      appState,
    );
  }
};

export const renderNewElementSceneThrottled = throttleRAF(
  (config: NewElementSceneRenderConfig) => {
    _renderNewElementScene(config);
  },
  { trailing: true },
);

export const renderNewElementScene = (
  renderConfig: NewElementSceneRenderConfig,
  throttle?: boolean,
) => {
  if (throttle) {
    renderNewElementSceneThrottled(renderConfig);
    return;
  }

  _renderNewElementScene(renderConfig);
};
