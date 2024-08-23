// src/PostData.js

import React, { useState } from "react";
import "./App.css";

function PostData({ refreshData }) {
  const [response, setResponse] = useState(null);
  const [content, setContent] = useState("");

  const handlePost = () => {
    fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data);
        if (refreshData) {
          refreshData(); // Call fetchData from FetchData component
        }
      });
  };

  return (
    <div className="container">
      <h2>Post Data</h2>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter some data"
      />
      <button
        style={{ marginLeft: "10px", width: "100px" }}
        onClick={handlePost}
      >
        Post Data
      </button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

export default PostData;
