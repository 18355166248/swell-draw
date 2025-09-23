import { appJotaiStore, Provider } from "app-jotai";
import { TopErrorBoundary } from "components/TopErrorBoundary";
import { useEffect } from "react";

const SwellDrawWrap = () => {
  useEffect(() => {
    console.log("App");
  }, []);

  return <div className="text-blue-500">React</div>;
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
