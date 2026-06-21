"use strict";

// counter state
const state = {
  todos: [],
  storageKey: "js_todo_demo_data"
};

// DOM references
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const btnClearCompleted = document.getElementById("btn-clear-completed");

// saves the current todos array to local storage
function saveTodos() {
  localStorage.setItem(state.storageKey, JSON.stringify(state.todos));
}

// loads todos from local storage when the page starts
function loadTodos() {
  const saved = localStorage.getItem(state.storageKey);
  if (saved) {
    state.todos = JSON.parse(saved);
  }
}

// updates the "X tasks left" text at the bottom
function updateStats() {
  const activeCount = state.todos.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

// rebuilds the HTML list of todos based on the state array
function renderTodos() {
  if (state.todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
  } else {
    todoList.innerHTML = state.todos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="btn-delete" aria-label="Delete">×</button>
      </li>
    `).join("");
  }
  updateStats();
}

// creates a new task object and adds it to the array
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  state.todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// switches the completed true/false status for a specific task
function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// completely removes a task from the array
function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

// removes any task that is marked as completed
function clearCompleted() {
  state.todos = state.todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
}


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text !== "") {
    addTodo(text);
    todoInput.value = "";
  }
});

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const li = e.target.closest("li");
    const id = parseInt(li.dataset.id, 10);
    deleteTodo(id);
  }
  
  if (e.target.classList.contains("todo-checkbox")) {
    const li = e.target.closest("li");
    const id = parseInt(li.dataset.id, 10);
    toggleTodo(id);
  }
});

btnClearCompleted.addEventListener("click", clearCompleted);

(function init() {
  loadTodos();
  renderTodos();
})();
