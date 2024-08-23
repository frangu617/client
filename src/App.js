// src/App.js

import React, { useState } from "react";
import "./App.css";
// import FetchData from "./FetchData";
// import PostData from "./PostData";
import ManageData from "./ManageData";

function App() {
  const [fetchData, setFetchData] = useState(null);

  return (
    <div className="container">
      <h1>Django + React App</h1>
      <ManageData />
    </div>
  );
}

export default App;
