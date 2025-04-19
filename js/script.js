const inputNewTask = document.querySelector("#task-input");
const tasksSection = document.querySelector("ul");
const counterTaskSection = document.querySelector("#task-counters");

counterTaskSection.querySelector(".all").addEventListener("click", () => {
  addSelectedClass(".all");
  filterTasks("all");
});
counterTaskSection.querySelector(".pending").addEventListener("click", () => {
  addSelectedClass(".pending");
  filterTasks("pending");
});
counterTaskSection.querySelector(".completed").addEventListener("click", () => {
  addSelectedClass(".completed");
  filterTasks("completed");
});

const allTaskCounter = counterTaskSection.querySelector(".total-tasks");
let totalTasks = 0;

window.onload = () => {
  inputNewTask.focus();
  loadTask();
  addSelectedClass(".all");
};

function filterTasks(type) {
  const tasks = document.querySelectorAll("ul li");

  tasks.forEach((task) => {
    const isDone = task.querySelector("span").classList.contains("done");

    if (type === "all") {
      task.style.display = "flex";
    } else if (type === "completed") {
      task.style.display = isDone ? "flex" : "none";
    } else if (type === "pending") {
      task.style.display = isDone ? "none" : "flex";
    }
  });
}

function addSelectedClass(type) {
  const counters = counterTaskSection.querySelectorAll("p");

  counters.forEach((counter) => {
    counter.classList.remove("selected");
  });

  const clickedP = counterTaskSection.querySelector(type);
  if (clickedP) {
    clickedP.classList.add("selected");
  }
}

inputNewTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputNewTask.value != "") {
    createTask(inputNewTask.value);
  }
});

function createTask(newTask) {
  totalTasks++;
  taskCounter();

  // Criando a tarefa no formato correto
  const li = document.createElement("li");
  li.classList.add("task-item");

  // div.task
  const divTask = document.createElement("div");
  divTask.classList.add("task");

  // check button
  const checkBtn = document.createElement("button");
  checkBtn.classList.add("icon-check");
  checkBtn.addEventListener("click", (e) => {
    taskDone(e.target.closest("li"));
  });

  // span
  const span = document.createElement("span");
  span.classList.add("task-title");
  span.textContent = newTask;

  divTask.appendChild(checkBtn);
  divTask.appendChild(span);

  // div.task-buttons
  const divButtons = document.createElement("div");
  divButtons.classList.add("task-buttons");

  // edit-btn
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("edit-btn");
  btnEdit.addEventListener("click", () => {
    editTask(li);
  });

  const iconEdit = document.createElement("div");
  iconEdit.classList.add("icon-edit");
  btnEdit.appendChild(iconEdit);

  // delete-btn
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("delete-btn");
  btnDelete.addEventListener("click", () => {
    removeTask(li);
  });

  const iconDelete = document.createElement("div");
  iconDelete.classList.add("icon-delete");
  btnDelete.appendChild(iconDelete);

  divButtons.appendChild(btnEdit);
  divButtons.appendChild(btnDelete);

  li.appendChild(divTask);
  li.appendChild(divButtons);

  tasksSection.appendChild(li);

  saveTasks();
  inputNewTask.value = "";
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskTitle = taskItem.querySelector(".task-title").textContent;
    const taskDone = taskItem
      .querySelector(".task-title")
      .classList.contains("done");

    tasks.push({
      title: taskTitle,
      done: taskDone,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(li) {
  totalTasks--;
  taskCounter();
  li.remove();
  saveTasks();
}

function loadTask() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    createTask(task.title);

    const lastTask = tasksSection.lastElementChild;
    if (task.done) {
      lastTask.querySelector(".task-title").classList.add("done");
      lastTask.querySelector(".icon-check").classList.add("clicked");
    }
  });
}

function editTask(li) {
  const checkIcon = li.querySelector(".icon-check");
  if (checkIcon.classList.contains("clicked")) {
    checkIcon.classList.remove("clicked");
  }
  const span = li.querySelector(".task-title");
  const currentText = span.textContent;

  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = currentText;
  inputEdit.classList.add("input-edit");

  span.replaceWith(inputEdit);
  inputEdit.focus();

  li.classList.add("editing");

  inputEdit.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit();
    }
  });

  inputEdit.addEventListener("blur", finishEdit);

  function finishEdit() {
    li.classList.remove("editing");
    const newText = inputEdit.value.trim();
    if (newText !== "") {
      const newSpan = document.createElement("span");
      newSpan.classList.add("task-title");
      newSpan.textContent = newText;
      inputEdit.replaceWith(newSpan);
      saveTasks();
    } else {
      removeTask(li);
      inputEdit.focus();
    }
  }
}

function taskDone(li) {
  const taskDone = li.querySelector(".task-title");
  taskDone.classList.toggle("done");
  const checkBtn = li.querySelector(".icon-check");
  checkBtn.classList.toggle("clicked");

  saveTasks();
}

function taskCounter() {
  allTaskCounter.textContent = totalTasks;
}
