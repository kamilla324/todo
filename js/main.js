// find elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

//проверка наличия данных в массиве по ключу tasks
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task) {
  console.log(task);
  //формируем css класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //добавляем разметку задачи на страницу html
  const taskHTML = `	
<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
    </button>
    <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
    </button>
</div>
</li>`;

  console.log(taskHTML);

  //добавить задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
});

checkEmptyList();
//Добавление задачи
form.addEventListener("submit", addTask);

function addTask(event) {
  //отменить отправку формф//перезагрузка страницы
  event.preventDefault();
  console.log("Submit");

  //достать текст из инпута
  const taskText = taskInput.value;

  //Объект для массива
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  //добавляем объект в массив
  tasks.push(newTask);
  saveToLS();
  console.log(tasks);
  //формируем css класс
  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  //добавляем разметку задачи на страницу html
  const taskHTML = `	
    <li id='${newTask.id}' class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;

  console.log(taskHTML);

  //добавить задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  //очищаем поле ввода
  taskInput.value = "";
  taskInput.focus();
  //скрываем список пуст
  //if(tasksList.children.length >1){
  // emptyList.classList.add('none')}
  //saveHTMLtoLS();
  checkEmptyList();
  saveToLS();
}

//Удаление задачи
tasksList.addEventListener("click", deleteTask);

function deleteTask(event) {
  //если клик не по кнопке delete
  if (event.target.dataset.action !== "delete") return;

  //по ней ищем целый тег li и заключаем в переменную, которую потом удаляем
  const parentNode = event.target.closest("li");

  //определяум id задачи
  const id = Number(parentNode.id);

  //находим индекс задачи в массиве
  const index = tasks.findIndex(function (task) {
    console.log(task);
    if (task.id == id) {
      return true;
    }
    //return task.id ===id или так
  });

  console.log(index);

  //Удаляем задачу по индексу из массива
  tasks.splice(index, 1);

  parentNode.remove();

  //показать список пуст при удалении последней задачи
  //if(tasksList.children.length === 1){
  //emptyList.classList.remove('none')}
  //saveHTMLtoLS();
  checkEmptyList();
  saveToLS();
}

//Зачеркнуть вып задачу
tasksList.addEventListener("click", doneTask);

function doneTask(event) {
  if (event.target.dataset.action === "done") {
    //находим родителя через событие е и заключаем в parentNode
    const parentNode = event.target.closest("li");
    //в этом  li находим спан с классом task-title с помощью querySelector

    const id = Number(parentNode.id);

    //найти задачу в массиве
    const task = tasks.find(function (task) {
      if (task.id === id) {
        return true;
      }
    });
    task.done = !task.done;

    const taskTitle = parentNode.querySelector(".task-title");
    //добавление класса с перечеркиванием
    taskTitle.classList.toggle("task-title--done");
  }
  //saveHTMLtoLS();
  saveToLS();
}

//сохраняем данные в Aplication Local Storage темный паттерн. В LS хранить только чистые данные
//function saveHTMLtoLS(){
// localStorage.setItem('tasksHTML', tasksList.innerHTML)}
//if(localStorage.getItem('tasksHTML')){
//  tasksList.innerHTML = localStorage.getItem('tasksHTML')
//}

//сохраняем данные 2 способ
//создаем массив, он наверху с константами

function checkEmptyList() {
  if (tasks.length == 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLS() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
