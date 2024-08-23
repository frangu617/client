// src/ManageData.js

import React, { useEffect, useState } from "react";
import "./App.css";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function ManageData() {
  const [data, setData] = useState([]);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  };

  const handlePost = () => {
    fetch("http://127.0.0.1:5000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), 
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data);
        fetchData(); // Refresh the data after posting
        setContent(""); // Clear the input field after posting
        alert("Data posted successfully!");
      });
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setEditItem(itemToEdit);
    setNewContent(itemToEdit.content);
  };

  const submitEdit = () => {
    fetch(`http://127.0.0.1:5000/api/data/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData(); // Refresh the data after editing
        setEditItem(null); // Close the edit mode
      });
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/data/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      });
  };

  return (
    <div className="container">
      <h2>Manage Data</h2>

      {/* Post Data Section */}
      <div className="post-data">
        <h3>Post Data</h3>
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
        {/* {response && <pre>{JSON.stringify(response, null, 2)}</pre>} */}
      </div>

      {/* Edit Data Modal */}
      {editItem && (
        <div className="edit-modal">
          <h3>Edit Item</h3>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={submitEdit}>Save</button>
          <button onClick={() => setEditItem(null)}>Cancel</button>
        </div>
      )}

      {/* Fetched Data Table */}
      <h3>Fetched Data</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.content}</td>
              <td>{item.timestamp}</td>
              <td>
                <button
                  style={{ marginRight: "10px", border: "2px solid green" }}
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button>
                <button
                  style={{ border: "2px solid yellow" }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageData;
