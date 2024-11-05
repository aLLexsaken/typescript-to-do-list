type Task = {
  id: number
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
input.placeholder="Enter a task";
const dayPlusList = document.querySelector<HTMLUListElement>("#day-plus");
const weekPlusList = document.querySelector<HTMLUListElement>("#week-plus");


const tasks: Task[] = loadTasks();
categorizeTasks();

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return


  const newTask: Task = {
    id: Date.now(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)
  saveTasks()

  addListItem(newTask)
  input.value = ""
})


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
  deleteButton.textContent = "Delete";
  deleteButton.id = "delete-button";
  deleteButton.onclick = () => deleteTask(task.id);

  const item = document.createElement("li");
  item.id = `${task.id}`; 
  const label = document.createElement("label");
  label.append(task.title);

  item.append(upButton, downButton, label, deleteButton);
  list?.append(item);
}

function deleteTask(id: number) {
  // Find the task index and remove it from the tasks array
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1); 
    saveTasks();

    const taskElement = document.getElementById(`${id}`);
    taskElement?.remove();
  }
}

function moveTaskUp(id: number) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex > 0) {

    [tasks[taskIndex - 1], tasks[taskIndex]] = [tasks[taskIndex], tasks[taskIndex - 1]];
    saveTasks();

    const taskElement = document.getElementById(`${id}`);
    const previousElement = taskElement?.previousElementSibling;
    if (taskElement && previousElement) {
      list?.insertBefore(taskElement, previousElement);
    }
  }
}

function moveTaskDown(id: number) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1 && taskIndex < tasks.length - 1) {
    [tasks[taskIndex], tasks[taskIndex + 1]] = [tasks[taskIndex + 1], tasks[taskIndex]];
    saveTasks();

    const taskElement = document.getElementById(`${id}`);
    const nextElement = taskElement?.nextElementSibling;
    if (taskElement && nextElement) {
      list?.insertBefore(nextElement, taskElement); // Place next element before current
    }
  }
}


function addListItemToList(task: Task, list: HTMLUListElement | null) {
  const upButton = document.createElement("button")
  upButton.textContent = "⤴"
  upButton.id = "move-button"
  const downButton = document.createElement("button")
  downButton.textContent = "⤵"
  downButton.id = "move-button"
  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Delete"
  deleteButton.id = "delete-Button"
  

  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  label.append(task.title)
  item.append(upButton, downButton, label, deleteButton)
  list?.append(item)
}

function saveTasks(){
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}
function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];

  return JSON.parse(taskJSON, (key, value) => {
      if (key === "createdAt") {
          return new Date(value); // Convert back to Date object
      }
      return value;
  });
}

function categorizeTasks() {
  const now = new Date();
  const oneDayAgo = new Date(now);
  const oneWeekAgo = new Date(now);
  const oneMonthAgo = new Date(now);

  oneDayAgo.setDate(now.getDate() - 1); 
  oneWeekAgo.setDate(now.getDate() - 7); 
  oneMonthAgo.setMonth(now.getMonth() - 1); 



  tasks.forEach((task) => {
      if (task.createdAt >= oneDayAgo) {
          addListItem(task);
      } else if (task.createdAt >= oneWeekAgo) {
          addListItemToList(task, dayPlusList);
      } else if (task.createdAt >= oneMonthAgo) {
          addListItemToList(task, weekPlusList);
      }
  });
}