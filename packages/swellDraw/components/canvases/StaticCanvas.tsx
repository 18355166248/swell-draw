import { memo, useEffect, useRef } from "react";
import {
  StaticCanvasAppState,
  RenderableElementsMap,
} from "@swell-draw/swellDraw/types";
import { RoughCanvas } from "roughjs/bin/canvas";
import { renderStaticScene } from "@swell-draw/swellDraw/renderer/renderStaticScene";
import {
  NonDeletedSceneElementsMap,
  NonDeletedSwellDrawElement,
} from "@swell-draw/element";

type StaticCanvasProps = {
  canvas: HTMLCanvasElement;
  appState: StaticCanvasAppState;
  scale: number;
  sceneNonce: number | undefined;
  elementsMap: RenderableElementsMap;
  allElementsMap: NonDeletedSceneElementsMap;
  visibleElements: readonly NonDeletedSwellDrawElement[];
  rc: RoughCanvas;
};

const StaticCanvas = (props: StaticCanvasProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isComponentMounted = useRef(false);

  useEffect(() => {
    props.canvas.style.width = props.appState.width + "px";
    props.canvas.style.height = props.appState.height + "px";
    props.canvas.width = props.appState.width * props.scale;
    props.canvas.height = props.appState.height * props.scale;
  }, [props.appState.width, props.appState.height, props.canvas, props.scale]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const canvas = props.canvas;
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;

      wrapper.replaceChildren(canvas);
      canvas.classList.add("swell-draw-canvas", "static-canvas");
    }

    renderStaticScene(
      {
        canvas,
        rc: props.rc,
        scale: props.scale,
        elementsMap: props.elementsMap,
        appState: props.appState,
        allElementsMap: props.allElementsMap,
        visibleElements: props.visibleElements,
      },
      true,
    );
  }, [
    props.allElementsMap,
    props.appState,
    props.canvas,
    props.elementsMap,
    props.rc,
    props.scale,
    props.visibleElements,
  ]);

  return (
    <div
      className="swell-draw-canvas-wrapper swell-draw-static-canvas"
      ref={wrapperRef}
    />
  );
};

const areEqual = (
  prevProps: StaticCanvasProps,
  nextProps: StaticCanvasProps,
) => {
  if (
    prevProps.sceneNonce !== nextProps.sceneNonce ||
    prevProps.elementsMap !== nextProps.elementsMap
  ) {
    return false;
  }

  return true;
};

export default memo(StaticCanvas, areEqual);
