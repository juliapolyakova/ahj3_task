import ArrTasks from './arrTasks';

const arrTasks = new ArrTasks();

export default class TasksList {
  constructor() {
    this.pinned = document.getElementById('pinned');
    this.allTasks = document.getElementById('all_tasks');
    this.inputForm = document.getElementById('input_form');
    this.inputTask = document.getElementById('input_task');
    this.error = document.querySelector('.error');
  }

  init() {
    this.redrawTasks(arrTasks.tasks);
    this.addEvent();
  }

  redrawTasks(elems) {
    this.pinned.innerHTML = '';
    this.allTasks.innerHTML = '';

    const havePinned = elems.some((item) => item.pinned);
    const noTask = elems.every((item) => item.pinned);

    if (!havePinned) {
      this.pinned.innerHTML = '<p>No pinned tasks</p>';
    }

    if (noTask) {
      this.allTasks.innerHTML = '<p>No tasks found</p>';
    }

    for (const item of elems) {
      const itemTask = document.createElement('div');
      itemTask.className = 'item_task';
      itemTask.dataset.id = item.id;
      itemTask.innerHTML = `
      <p>${item.name}</p>
      <div class="checked">${item.pinned ? 'V' : ''}</div>
      `;

      if (item.pinned) {
        this.pinned.appendChild(itemTask);
      } else {
        this.allTasks.appendChild(itemTask);
      }
    }
  }

  addEvent() {
    this.inputForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const elementValue = this.inputTask.value;

      if (elementValue === '') {
        this.error.classList.remove('hidden');
        return;
      }

      if (!this.error.classList.contains('hidden')) {
        this.error.classList.add('hidden');
      }

      arrTasks.addTask(this.inputTask.value);
      this.inputTask.value = '';
      this.filterTask(this.inputTask.value);
    });

    this.inputTask.addEventListener('input', () => {
      this.filterTask(this.inputTask.value);
    });

    this.pinned.addEventListener('click', (event) => {
      if (event.target.className === 'checked') {
        const elemId = event.target.closest('.item_task').dataset.id;

        this.moveTask(elemId, false);
      }
    });

    this.allTasks.addEventListener('click', (event) => {
      if (event.target.className === 'checked') {
        const elemId = event.target.closest('.item_task').dataset.id;
        this.moveTask(elemId, true);
      }
    });

    this.error.addEventListener('click', (event) => {
      if (event.target.className === 'close_error') {
        this.error.classList.add('hidden');
      }
    });
  }

  filterTask(value) {
    const filtrArr = arrTasks.tasks.filter((item) => {
      const valueLowerCase = value.trim().toLowerCase();
      const trueName = item.name.toLowerCase().includes(valueLowerCase);
      return trueName || item.pinned;
    });

    this.redrawTasks(filtrArr);
  }

  moveTask(itemIdTask, pinned) {
    const idTask = arrTasks.tasks.findIndex((item) => item.id === Number(itemIdTask));
    arrTasks.tasks[idTask].pinned = pinned;
    this.filterTask(this.inputTask.value);
  }
}
