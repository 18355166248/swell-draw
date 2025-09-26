import { appJotaiStore, Provider } from "app-jotai";
import { TopErrorBoundary } from "components/TopErrorBoundary";
import { SwellDraw } from "@swell-draw/swellDraw";
import {
  EditorJotaiProvider,
  editorJotaiStore,
} from "@swell-draw/swellDraw/editor-jotai";
import clsx from "clsx";

const SwellDrawWrap = () => {
  return (
    <div className={clsx("swell-draw")}>
      <SwellDraw></SwellDraw>
    </div>
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
