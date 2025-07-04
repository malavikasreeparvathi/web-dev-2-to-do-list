import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// 👇👇👇 Replace with your Render backend URL when deployed
const API_BASE_URL = "http://localhost:5000";
// Example for Render: 
// const API_BASE_URL = "https://web-dev-2-to-do-list.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/todos`, { text });
      setTodos([...todos, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/todos/${id}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: res.data.completed } : todo
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await axios.put(`${API_BASE_URL}/api/todos/${id}`, {
        text: editingText,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, text: res.data.text } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>My Todo List</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ margin: "10px 0" }}>
            {editingId === todo._id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                <button onClick={() => toggleTodo(todo._id, todo.completed)}>
                  {todo.completed ? "Undo" : "Done"}
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                <button
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditingText(todo.text);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
