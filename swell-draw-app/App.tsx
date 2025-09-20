import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    console.log("App");
  }, []);

  return <div>React</div>;
};

export default App;
