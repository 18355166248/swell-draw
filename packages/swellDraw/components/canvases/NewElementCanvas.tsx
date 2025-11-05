import { NonDeletedSceneElementsMap } from "@swell-draw/element";
import { renderNewElementScene } from '@swell-draw/swellDraw/renderer/renderNewElementScene';
import { AppState, RenderableElementsMap } from "@swell-draw/swellDraw/types";
import { useEffect, useRef } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";

type NewElementCanvasProps = {
  appState: AppState;
  elementsMap: RenderableElementsMap;
  allElementsMap: NonDeletedSceneElementsMap;
  scale: number;
  rc: RoughCanvas;
};

const NewElementCanvas = (props: NewElementCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    renderNewElementScene(
      {
        canvas: canvasRef.current,
        scale: props.scale,
        newElement: props.appState.newElement,
        elementsMap: props.elementsMap,
        allElementsMap: props.allElementsMap,
        rc: props.rc,
        appState: props.appState,
      },
      true,
    );
  });

  return (
    <canvas
      className="swell-draw-canvas"
      style={{
        width: props.appState.width,
        height: props.appState.height,
      }}
      width={props.appState.width * props.scale}
      height={props.appState.height * props.scale}
      ref={canvasRef}
    />
  );
};

export default NewElementCanvas;
