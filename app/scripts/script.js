const changeThemeBtn = document.querySelector("[data-change-theme-btn]");
const btnImage = document.querySelector("[data-change-theme-btn-image]");

// THEMES
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

/////////////////////////  Handle Template Items  ///////////////////////////////////

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

// Appending all existing todos based on localStorage
existingTodos.forEach((todo) => {
  const todoClone = todoTemplate.content.cloneNode(true);
  const newTodoCheckboxTemplate = todoClone.querySelector("[data-todo-template-checkbox]");
  const newTodoLabelTemplate = todoClone.querySelector("[data-todo-template-label]");

  newTodoLabelTemplate.textContent = todo.value;
  newTodoCheckboxTemplate.checked = todo.isChecked;
  checkCheckboxStatus(newTodoCheckboxTemplate, newTodoLabelTemplate);

  if (newTodoCheckboxTemplate.checked) {
    newTodoLabelTemplate.classList.add("checked");
  }

  newTodoCheckboxTemplate.name = newTodoCheckboxTemplate.name + incrementor;
  newTodoCheckboxTemplate.id = newTodoCheckboxTemplate.id + incrementor;
  newTodoLabelTemplate.setAttribute("for", newTodoCheckboxTemplate.id);

  todoListContainer.appendChild(todoClone);

  incrementor++;

  changeLengthText();
});

newTodo.addEventListener("keydown", (e) => {
  const todoClone = todoTemplate.content.cloneNode(true);
  const newTodoCheckboxTemplate = todoClone.querySelector("[data-todo-template-checkbox]");
  const newTodoLabelTemplate = todoClone.querySelector("[data-todo-template-label]");

  // Adding element on keydown of Enter
  if (e.keyCode === 13 && newTodo.value != "") {
    newTodoLabelTemplate.textContent = newTodo.value;
    checkCheckboxStatus(newTodoCheckboxTemplate, newTodoLabelTemplate);

    // Changing attributes values based on length
    newTodoCheckboxTemplate.name = newTodoCheckboxTemplate.name + incrementor;
    newTodoCheckboxTemplate.id = newTodoCheckboxTemplate.id + incrementor;
    newTodoLabelTemplate.setAttribute("for", newTodoCheckboxTemplate.id);

    // Hiding todos based on which navigation button is active
    if (newTodoCheckboxTemplate.checked && activeBtn.classList.contains("active")) {
      newTodoCheckboxTemplate.closest("[data-todo-item]").classList.add("hide");
    }

    if (!newTodoCheckboxTemplate.checked && completedBtn.classList.contains("active")) {
      newTodoCheckboxTemplate.closest("[data-todo-item]").classList.add("hide");
    }

    // Appending new todo item
    todoListContainer.appendChild(todoClone);

    // Adding todo to localStorage
    existingTodos.push({
      value: newTodo.value,
      isChecked: newTodoCheckbox.checked,
    });
    localStorage.setItem("todos", JSON.stringify(existingTodos));

    // Reset initial values
    newTodo.value = "";
    newTodoCheckbox.checked = false;
    // Incrementing value by 1
    incrementor++;

    changeLengthText();
  }
});

// Handle checked status
todoListContainer.addEventListener("click", (e) => {
  const todoItem = e.target.closest("[data-todo-item]");
  const label = todoItem.querySelector("[data-todo-label]");
  const todoIndex = existingTodos.findIndex((todo) => todo.value === label.textContent);

  if (e.target.matches("[data-todo-checkbox]")) {
    label.classList.toggle("checked");
    // Updating check status in exisiting todos in localStorage
    existingTodos[todoIndex].isChecked = !existingTodos[todoIndex].isChecked;
    localStorage.setItem("todos", JSON.stringify(existingTodos));
  }

  // Deleting todo on deleteBtn click
  if (e.target.matches("[data-todo-delete-btn], [data-todo-delete-btn-image]")) {
    todoItem.remove();
    // Updating todos on localStorage after deleting todo
    existingTodos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(existingTodos));

    changeLengthText();
  }
});

// Deleting all completed tasks
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
      localStorage.setItem("todos", JSON.stringify(existingTodos));
    }
    changeLengthText();
  });
});

const todoNavigation = document.querySelector("[data-todo-navigation]");
const navigationButtons = todoNavigation.querySelectorAll("*");

// Hiding all not completed tasks if they're visible
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

// Hiding all completed tasks if they're visible
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

// Show all tasks
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

// Checking status of checkbox
function checkCheckboxStatus(checkingCheckbox, labelOfCheckbox) {
  if (newTodoCheckbox.checked) {
    checkingCheckbox.checked = true;
    labelOfCheckbox.classList.add("checked");
  }
}

// Changing text of list length
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
