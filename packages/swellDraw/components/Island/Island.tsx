import clsx from "clsx";
import { forwardRef } from "react";
import "./Island.scss";

type IslandProps = {
  children: React.ReactNode;
  padding?: number;
  className?: string | boolean;
  style?: React.CSSProperties;
};

export const Island = forwardRef<HTMLDivElement, IslandProps>(
  ({ children, padding, className, style }, ref) => (
    <div
      className={clsx("Island", className)}
      style={{ "--padding": padding, ...style } as React.CSSProperties}
      ref={ref}
    >
      {children}
    </div>
  ),
);
