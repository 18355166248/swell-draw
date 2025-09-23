import { TopErrorBoundary } from "components/TopErrorBoundary";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    console.log("App");
  }, []);

  return (
    <TopErrorBoundary>
      <div className="text-blue-500">React</div>
    </TopErrorBoundary>
  );
};

export default App;
