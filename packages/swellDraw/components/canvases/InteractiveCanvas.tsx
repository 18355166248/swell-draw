import { InteractiveCanvasAppState } from "@swell-draw/swellDraw/types";
import { DOMAttributes, useEffect, useRef } from "react";

type InteractiveCanvasProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvas: HTMLCanvasElement | null;
  appState: InteractiveCanvasAppState;
  scale: number;
  handleCanvasRef: (canvas: HTMLCanvasElement | null) => void;
  onPointerDown: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerDown"],
    undefined
  >;
  onPointerUp: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerUp"],
    undefined
  >;
  onPointerMove: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerMove"],
    undefined
  >;
  onPointerCancel: Exclude<
    DOMAttributes<HTMLCanvasElement>["onPointerCancel"],
    undefined
  >;
};

const InteractiveCanvas = (props: InteractiveCanvasProps) => {
  const isComponentMounted = useRef(false);
  useEffect(() => {
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;
      return;
    }
  });

  return (
    <canvas
      className="swell-draw-canvas interactive"
      ref={props.handleCanvasRef}
      style={{
        width: props.appState.width,
        height: props.appState.height,
      }}
      width={props.appState.width * props.scale}
      height={props.appState.height * props.scale}
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
      onPointerMove={props.onPointerMove}
      onPointerCancel={props.onPointerCancel}
    />
  );
};

export default InteractiveCanvas;
