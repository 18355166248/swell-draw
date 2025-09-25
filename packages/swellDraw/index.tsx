import { memo } from "react";
import { SwellDrawProps } from "./types";

const SwellDrawBase = ({ children }: SwellDrawProps) => {
  return <div>{children}</div>;
};

const areEqual = (
  prevProps: Readonly<typeof SwellDrawBase>,
  nextProps: Readonly<typeof SwellDrawBase>,
) => {
  return prevProps === nextProps;
};

export const SwellDraw = memo(SwellDrawBase, areEqual);
SwellDraw.displayName = "SwellDraw";
