import { createContext, useContext } from "react";

export const SwellDrawContext = createContext<{
  container: HTMLDivElement | null;
  id: string;
}>({
  container: null,
  id: "",
});
SwellDrawContext.displayName = "SwellDrawContext";

export const useSwellDrawContext = () => useContext(SwellDrawContext);
