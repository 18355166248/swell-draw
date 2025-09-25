import { appJotaiStore, Provider } from "app-jotai";
import { TopErrorBoundary } from "components/TopErrorBoundary";
import { useEffect } from "react";
import { SwellDraw } from "@swell-draw/swellDraw";
import {
  EditorJotaiProvider,
  editorJotaiStore,
} from "@swell-draw/swellDraw/editor-jotai";

const SwellDrawWrap = () => {
  useEffect(() => {
    console.log("App");
  }, []);

  return (
    <SwellDraw>
      <div className="text-blue-500">React</div>
    </SwellDraw>
  );
};

const App = () => {
  return (
    <EditorJotaiProvider store={editorJotaiStore}>
      <TopErrorBoundary>
        <Provider store={appJotaiStore}>
          <SwellDrawWrap />
        </Provider>
      </TopErrorBoundary>
    </EditorJotaiProvider>
  );
};

export default App;
