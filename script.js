const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Load saved tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
});

function addTask(taskText) {
  const li = document.createElement('li');

  // Task text span (only this toggles completion)
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  taskSpan.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  // Delete card + button
  const deleteCard = document.createElement('div');
  deleteCard.classList.add('delete-card');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✖'; // cleaner icon
  deleteBtn.classList.add('delete-btn');

  // Delete action only (no crossing out)
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevents toggling complete
    li.remove();
    saveTasks();
  });

  deleteCard.appendChild(deleteBtn);
  li.appendChild(taskSpan);
  li.appendChild(deleteCard);
  list.appendChild(li);
  saveTasks();
}
deleteBtn.setAttribute("aria-label", "Delete task");

function saveTasks() {
  const tasks = [];
  list.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    addTask(task.text);
    if (task.completed) {
      list.lastChild.classList.add('completed');
    }
  });
}