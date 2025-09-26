import { InteractiveCanvasAppState } from "@swell-draw/swellDraw/types";
import { useEffect, useRef } from "react";

type InteractiveCanvasProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvas: HTMLCanvasElement | null;
  appState: InteractiveCanvasAppState;
  scale: number;
  handleCanvasRef: (canvas: HTMLCanvasElement | null) => void;
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
    />
  );
};

export default InteractiveCanvas;
