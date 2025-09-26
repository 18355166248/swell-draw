import { Component, createRef } from "react";
import { AppClassProperties, AppProps, AppState } from "../types";
import StaticCanvas from "./canvases/StaticCanvas";
import rough from "roughjs/bin/rough";
import type { RoughCanvas } from "roughjs/bin/canvas";
import InteractiveCanvas from "./canvases/InteractiveCanvas";
import { EVENT } from "@swell-draw/common";

class App extends Component<AppProps, AppState> {
  canvas: AppClassProperties["canvas"];
  interactiveCanvas: AppClassProperties["interactiveCanvas"] = null;
  rc: RoughCanvas;

  private swellDrawContainerRef = createRef<HTMLDivElement>();

  constructor(props: AppProps) {
    super(props);
    this.state = {
      isLoading: true,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas = document.createElement("canvas");
    this.rc = rough.canvas(this.canvas);
  }

  private handleInteractiveCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas !== null) {
      this.interactiveCanvas = canvas;

      // -----------------------------------------------------------------------
      // NOTE wheel, touchstart, touchend events must be registered outside
      // of react because react binds them them passively (so we can't prevent
      // default on them)
      this.interactiveCanvas.addEventListener(
        EVENT.TOUCH_START,
        this.onTouchStart,
        { passive: false },
      );
      this.interactiveCanvas.addEventListener(EVENT.TOUCH_END, this.onTouchEnd);
      // -----------------------------------------------------------------------
    } else {
      this.interactiveCanvas?.removeEventListener(
        EVENT.TOUCH_START,
        this.onTouchStart,
      );
      this.interactiveCanvas?.removeEventListener(
        EVENT.TOUCH_END,
        this.onTouchEnd,
      );
    }
  };

  private onTouchStart = (event: TouchEvent) => {
    console.log("onTouchStart", event);
  };

  private onTouchEnd = (event: TouchEvent) => {
    console.log("onTouchEnd", event);
  };

  public render() {
    return (
      <div>
        <StaticCanvas
          canvas={this.canvas}
          appState={this.state}
          scale={window.devicePixelRatio}
        />
        <InteractiveCanvas
          containerRef={this.swellDrawContainerRef}
          canvas={this.interactiveCanvas}
          appState={this.state}
          scale={window.devicePixelRatio}
          handleCanvasRef={this.handleInteractiveCanvasRef}
        />
      </div>
    );
  }
}

export default App;
