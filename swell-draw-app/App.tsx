import { appJotaiStore, Provider } from "app-jotai";
import { TopErrorBoundary } from "components/TopErrorBoundary";
import { useEffect } from "react";
import { SwellDraw } from "@swell-draw/swellDraw";

const SwellDrawWrap = () => {
  useEffect(() => {
    console.log("App");
    throw new Error("test");
  }, []);

  return (
    <SwellDraw>
      <div className="text-blue-500">React</div>
    </SwellDraw>
  );
};

const App = () => {
  return (
    <TopErrorBoundary>
      <Provider store={appJotaiStore}>
        <SwellDrawWrap />
      </Provider>
    </TopErrorBoundary>
  );
};

export default App;
