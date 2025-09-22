import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    console.log("App");
  }, []);

  return <div className="text-blue-500">React</div>;
};

export default App;
