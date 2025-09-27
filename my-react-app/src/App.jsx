import React, { useEffect } from "react";
import createLineChart from "./utils";

function App() {
  useEffect(() => {
    createLineChart();
    console.log("This has run")
  }, []);

  return (
    <>

    </>
  );
}

export default App