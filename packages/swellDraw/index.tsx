import { memo } from "react";
import { SwellDrawProps } from "./types";
import { EditorJotaiProvider } from "./editor-jotai";
import { editorJotaiStore } from "./editor-jotai";

const SwellDrawBase = ({ children }: SwellDrawProps) => {
  return (
    <EditorJotaiProvider store={editorJotaiStore}>
      {children}
    </EditorJotaiProvider>
  );
};

const areEqual = (
  prevProps: Readonly<typeof SwellDrawBase>,
  nextProps: Readonly<typeof SwellDrawBase>,
) => {
  return prevProps === nextProps;
};

export const SwellDraw = memo(SwellDrawBase, areEqual);
SwellDraw.displayName = "SwellDraw";
