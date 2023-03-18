const changeThemeBtn = document.querySelector("[data-change-theme-btn]");
const btnImage = document.querySelector("[data-change-theme-btn-image]");

//* THEMES
window.addEventListener("load", () => {
  if (localStorage.getItem("theme")) {
    setThemeBasedOnLocalStorage();
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setDarkTheme();
  }
});

changeThemeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
  setThemeBasedOnLocalStorage();
});

function setThemeBasedOnLocalStorage() {
  if (localStorage.getItem("theme") === "dark") {
    setDarkTheme();
  } else {
    setLightTheme();
  }
}

function setDarkTheme() {
  document.body.classList.add("dark");
  btnImage.src = "assets/images/icon-sun.svg";
  btnImage.alt = "sun icon";
}

function setLightTheme() {
  document.body.classList.remove("dark");
  btnImage.src = "assets/images/icon-moon.svg";
  btnImage.alt = "moon icon";
}

//////////////////* Handle Template Items ///////////////////////

const newTodo = document.querySelector("[data-new-todo-input]");
const newTodoCheckbox = document.querySelector("[data-new-todo-checkbox]");
const todoListContainer = document.querySelector("[data-todo-list-container]");
const todoTemplate = document.querySelector("[data-todo-template]");
const todoListLength = document.querySelector("[data-todo-list-length]");

const completedBtn = document.querySelector("[data-todo-completed-btn]");
const activeBtn = document.querySelector("[data-todo-active-btn]");
const allBtn = document.querySelector("[data-todo-all-btn]");

let incrementor = 1;
const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];

//* Appending all existing todos based on localStorage
existingTodos.forEach((todo) => {
  addTodoItem(todo);
  incrementor++;
  changeLengthText();
});

//* Adding new todo item on Enter key press
newTodo.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && newTodo.value != "") {
    const newTodoValue = newTodo.value;
    const newTodoChecked = newTodoCheckbox.checked;

    addTodoItem({
      value: newTodoValue,
      isChecked: newTodoChecked,
    });

    existingTodos.push({
      value: newTodoValue,
      isChecked: newTodoChecked,
    });
    updateLocalStorageTodos(existingTodos);

    newTodo.value = "";
    newTodoCheckbox.checked = false;
    incrementor++;
    changeLengthText();
  }
});

//* Handle checked status
todoListContainer.addEventListener("click", (e) => {
  const todoItem = e.target.closest("[data-todo-item]");
  const label = todoItem.querySelector("[data-todo-label]");
  const todoIndex = existingTodos.findIndex((todo) => todo.value === label.textContent);

  if (e.target.matches("[data-todo-checkbox]")) {
    label.classList.toggle("checked");
    // Updating check status in exisiting todos in localStorage
    existingTodos[todoIndex].isChecked = !existingTodos[todoIndex].isChecked;

    // Preventing todo items from changing places on changing checkboxes status
    handleDragEndDropLocalStoragePosition();
  }

  //* Deleting todo on deleteBtn click
  if (e.target.matches("[data-todo-delete-btn], [data-todo-delete-btn-image]")) {
    todoItem.remove();
    // Updating todos on localStorage after deleting todo
    existingTodos.splice(todoIndex, 1);
    updateLocalStorageTodos(existingTodos);

    changeLengthText();
  }
});

//* Deleting all completed tasks
const clearCompletedBtn = document.querySelector("[data-clear-all-completed-btn]");
clearCompletedBtn.addEventListener("click", () => {
  const checkboxs = document.querySelectorAll("[data-todo-checkbox]");

  checkboxs.forEach((checkbox) => {
    const checkedTodoItem = checkbox.closest("[data-todo-item]");
    if (checkbox.checked && !checkedTodoItem.classList.contains("hide")) {
      checkedTodoItem.remove();

      const label = checkedTodoItem.querySelector("[data-todo-label]");
      const todoIndex = existingTodos.findIndex((todo) => todo.value === label.textContent);
      existingTodos.splice(todoIndex, 1);
      updateLocalStorageTodos(existingTodos);
    }
    changeLengthText();
  });
});

const todoNavigation = document.querySelector("[data-todo-navigation]");
const navigationButtons = todoNavigation.querySelectorAll("*");

//* Hiding all not completed tasks if they're visible
completedBtn.addEventListener("click", () => {
  navigationButtons.forEach((btn) => btn.classList.remove("active"));
  completedBtn.classList.add("active");

  const checkboxs = document.querySelectorAll("[data-todo-checkbox]");

  checkboxs.forEach((checkbox) => {
    const uncompletedItem = checkbox.closest("[data-todo-item]");
    uncompletedItem.classList.remove("hide");
    if (!checkbox.checked) {
      uncompletedItem.classList.add("hide");
    }
    changeLengthText();
  });
});

//* Hiding all completed tasks if they're visible
activeBtn.addEventListener("click", () => {
  navigationButtons.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");

  const checkboxs = document.querySelectorAll("[data-todo-checkbox]");

  checkboxs.forEach((checkbox) => {
    const completedItem = checkbox.closest("[data-todo-item]");
    completedItem.classList.remove("hide");
    if (checkbox.checked) {
      completedItem.classList.add("hide");
    }
    changeLengthText();
  });
});

//* Showing all tasks
allBtn.addEventListener("click", () => {
  navigationButtons.forEach((btn) => btn.classList.remove("active"));
  allBtn.classList.add("active");

  const checkboxs = document.querySelectorAll("[data-todo-checkbox]");

  checkboxs.forEach((checkbox) => {
    const taskItem = checkbox.closest("[data-todo-item]");
    taskItem.classList.remove("hide");
  });
  changeLengthText();
});

//* Checking status of checkbox
function checkCheckboxStatus(checkingCheckbox, labelOfCheckbox) {
  if (newTodoCheckbox.checked) {
    checkingCheckbox.checked = true;
    labelOfCheckbox.classList.add("checked");
  }
}

//* Changing text of list length
function changeLengthText() {
  let todoListLengthText = " items left";
  let visibleChildCount = 0;

  for (let i = 0; i < todoListContainer.children.length; i++) {
    const child = todoListContainer.children[i];

    if (!child.classList.contains("hide")) {
      visibleChildCount++;
    }
  }

  if (visibleChildCount <= 1) {
    todoListLengthText = " item left";
  }

  todoListLength.textContent = visibleChildCount + todoListLengthText;
}

function addTodoItem(item) {
  const todoClone = todoTemplate.content.cloneNode(true);
  const newTodoCheckboxTemplate = todoClone.querySelector("[data-todo-template-checkbox]");
  const newTodoLabelTemplate = todoClone.querySelector("[data-todo-template-label]");

  newTodoLabelTemplate.textContent = item.value;
  newTodoCheckboxTemplate.checked = item.isChecked;
  checkCheckboxStatus(newTodoCheckboxTemplate, newTodoLabelTemplate);

  if (newTodoCheckboxTemplate.checked) {
    newTodoLabelTemplate.classList.add("checked");
  }

  newTodoCheckboxTemplate.name = newTodoCheckboxTemplate.name + incrementor;
  newTodoCheckboxTemplate.id = newTodoCheckboxTemplate.id + incrementor;
  newTodoLabelTemplate.setAttribute("for", newTodoCheckboxTemplate.id);

  todoListContainer.appendChild(todoClone);
}

// Function to update todo list in localStorage
function updateLocalStorageTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to update todo list in localStorage after drag and drop
function handleDragEndDropLocalStoragePosition() {
  const draggables = document.querySelectorAll("[data-todo-item]");
  const newTodos = [];
  const uniqueValues = [];
  draggables.forEach((element) => {
    const value = element.querySelector("[data-todo-label]").textContent;
    const isChecked = element.querySelector("[data-todo-checkbox]").checked;

    // Adding new todo item only if it's unique
    if (!uniqueValues.includes(value)) {
      newTodos.push({ value, isChecked });
      uniqueValues.push(value);
    }
  });
  updateLocalStorageTodos(newTodos);
}

////////////////////////* Drag and drop functionality ////////////////////////

var sortable = Sortable.create(todoListContainer, {
  animation: 150,
  ghostClass: "dragging",
  onChange: handleDragEndDropLocalStoragePosition(),
});

//* Enables of dragging new todos in container
todoListContainer.addEventListener("DOMNodeInserted", (e) => {
  handleDragEndDropLocalStoragePosition();
});
