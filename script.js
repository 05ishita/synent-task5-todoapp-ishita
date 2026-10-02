const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const remainingCount = document.getElementById("remainingCount");
const totalCount = document.getElementById("totalCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });

  updateStats(filteredTasks);
}

function updateStats(filteredTasks) {
  const remaining = tasks.filter((task) => !task.completed).length;

  remainingCount.textContent = remaining;

  totalCount.textContent =
    tasks.length === 1 ? "1 task" : `${tasks.length} tasks`;

  emptyState.style.display =
    filteredTasks.length === 0 ? "block" : "none";
}

function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    return;
  }

  addTask(text);

  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
});

renderTasks();