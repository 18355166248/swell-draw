import { memo } from "react";
import { SwellDrawProps } from "./types";
import App from "./components/App";
import "./css/index.scss";

const SwellDrawBase = ({ children }: SwellDrawProps) => {
  return <App>{children}</App>;
};

const areEqual = (
  prevProps: Readonly<typeof SwellDrawBase>,
  nextProps: Readonly<typeof SwellDrawBase>,
) => {
  return prevProps === nextProps;
};

export const SwellDraw = memo(SwellDrawBase, areEqual);
SwellDraw.displayName = "SwellDraw";
