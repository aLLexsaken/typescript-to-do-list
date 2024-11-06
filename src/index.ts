type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
input.placeholder = "Enter a task";
const dayPlusList = document.querySelector<HTMLUListElement>("#day-plus");
const weekPlusList = document.querySelector<HTMLUListElement>("#week-plus");
const allBtn = document.getElementById("all-btn") as HTMLLIElement | null;
const pendingBtn = document.getElementById("pending-btn") as HTMLLIElement | null;
const completedBtn = document.getElementById("completed-btn") as HTMLLIElement | null;

const tasks: Task[] = loadTasks();
displayTasks(); // Initially display all tasks

// Event listener for form submission (to add tasks)
form?.addEventListener("submit", e => {
  e.preventDefault();
  if (input?.value === "" || input?.value == null) return;

  const newTask: Task = {
    id: Date.now(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  };
  tasks.push(newTask);
  saveTasks();
  displayTasks();
  input.value = "";
});

// Add a task item to the list
function addListItem(task: Task) {
  const upButton = document.createElement("button");
  upButton.textContent = "⤴";
  upButton.id = "move-button";
  upButton.onclick = () => moveTaskUp(task.id);

  const downButton = document.createElement("button");
  downButton.textContent = "⤵";
  downButton.id = "move-button";
  downButton.onclick = () => moveTaskDown(task.id);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.id = "delete-Button";
  deleteButton.onclick = () => deleteTask(task.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id="checkbox"
  checkbox.checked = task.completed;
  checkbox.onclick = () => toggleTaskStatus(task.id);

  const item = document.createElement("li");
  item.id = `${task.id}`;
  const label = document.createElement("label");
  label.append(task.title);

  item.append(checkbox, upButton, downButton, label, deleteButton);
  list?.append(item);
}

// Delete a task
function deleteTask(id: number) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    displayTasks();
  }
}

function moveTaskUp(id: number) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex > 0) {
    [tasks[taskIndex - 1], tasks[taskIndex]] = [tasks[taskIndex], tasks[taskIndex - 1]];
    saveTasks();
    displayTasks(); 
  }
}


function moveTaskDown(id: number) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1 && taskIndex < tasks.length - 1) {
    [tasks[taskIndex], tasks[taskIndex + 1]] = [tasks[taskIndex + 1], tasks[taskIndex]];
    saveTasks();
    displayTasks(); 
  }
}


function toggleTaskStatus(id: number) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    displayTasks(); 
  }
}


function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}


function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON, (key, value) => {
    if (key === "createdAt") {
      return new Date(value); 
    }
    return value;
  });
}


function displayTasks(filter?: string) {

  list.innerHTML = "";

  const filteredTasks = filterTasks(filter);

  filteredTasks.forEach((task) => {
    addListItem(task);
  });
}

// Filter tasks based on the selected filter type (All, Pending, Completed)
function filterTasks(filter?: string): Task[] {
  switch (filter) {
    case "pending":
      return tasks.filter(task => !task.completed);
    case "completed":
      return tasks.filter(task => task.completed);
    default:
      return tasks; // Default to "All"
  }
}

// Filter tasks when filter buttons are clicked
if (allBtn) {
  allBtn.addEventListener("click", () => displayTasks("all"));
}

if (pendingBtn) {
  pendingBtn.addEventListener("click", () => displayTasks("pending"));
}

if (completedBtn) {
  completedBtn.addEventListener("click", () => displayTasks("completed"));
}
