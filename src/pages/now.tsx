// TodoApp.js
"use client";
import { useState, useEffect } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Load todos from local storage on component mount
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  }, []);

  // Save todos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Function to handle adding new todo
  const addTodo = (todoText) => {
    if (todoText.trim() !== "") {
      setTodos([...todos, { text: todoText, completed: false }]);
      setNewTodo(""); // Clear input after adding
    }
  };

  // Function to handle deleting todo
  const deleteTodo = (indexToDelete) => {
    setTodos(todos.filter((_, index) => index !== indexToDelete));
  };

  // Function to handle marking todo as complete
  const toggleComplete = (indexToToggle) => {
    setTodos(
      todos.map((todo, index) =>
        index === indexToToggle ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white container mx-auto p-8 my-10 rounded-xl shadow-lg max-w-3xl">
        <h1 className="font-bold text-3xl text-center text-gray-800 mb-8">
          Welcome to iTodo
        </h1>

        <div className="flex flex-col items-center mb-8">
          <textarea
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            rows="3"
          ></textarea>
          <button
            onClick={() => addTodo(newTodo)}
            className="w-full md:w-1/3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
          >
            Add Todo
          </button>
        </div>

        {todos.length > 0 ? (
          <ul className="list-none space-y-4">
            {todos.map((todo, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-4 rounded-lg shadow-sm transition duration-300 ${
                  todo.completed ? "bg-gray-300" : "bg-blue-100"
                }`}
              >
                <button
                  onClick={() => toggleComplete(index)}
                  className={`mr-4 p-2 rounded-full transition duration-300 ${
                    todo.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 hover:bg-green-500 text-gray-700 hover:text-white"
                  }`}
                >
                  {todo.completed ? "✔" : "○"}
                </button>
                <span
                  className={`flex-grow text-gray-700 font-medium ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(index)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No todos yet! Add one above.</p>
        )}
      </div>
    </div>
  );
}
