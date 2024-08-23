// src/FetchData.js

import React, { useEffect, useState } from "react";
import "./App.css";

function FetchData({ setFetchDataRef }) {
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [newContent, setNewContent] = useState("");

  const fetchData = () => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  };

useEffect(() => {
  fetchData();
  setFetchDataRef(fetchData); // Expose fetchData to parent
}, [setFetchDataRef]);
  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setEditItem(itemToEdit);
    setNewContent(itemToEdit.content);
  };

  const submitEdit = () => {
    fetch(`/api/data/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData(); // Refresh the data
        setEditItem(null); // Close the edit mode
      });
  };

  // Handles the delete request
  const handleDelete = (id) => {
    fetch(`/api/data/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      });
  };

  return (
    <div className="container">
      <h2>Fetched Data:</h2>
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

export default FetchData;
