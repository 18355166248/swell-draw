import { useEffect, useRef } from "react";
import { InteractiveCanvasAppState } from "@swell-draw/swellDraw/types";

type StaticCanvasProps = {
  canvas: HTMLCanvasElement;
  appState: InteractiveCanvasAppState;
  scale: number;
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
      canvas.classList.add("swell-draw-canvas");
    }
  }, [props.canvas]);

  return <div className="swell-draw-canvas-wrapper" ref={wrapperRef} />;
};

export default StaticCanvas;
