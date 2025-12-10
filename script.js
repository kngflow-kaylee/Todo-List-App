const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const darkToggle = document.getElementById('darkModeToggle');

// Load saved tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
  }
});

// Add new task
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = '';
  input.focus(); // return focus for workflow
});

// Add task function
function addTask(taskText, completed = false) {
  const li = document.createElement('li');
  li.setAttribute('draggable', 'true');
  li.setAttribute('title', 'Drag to reorder tasks'); // tooltip

  // Task text span
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  taskSpan.setAttribute('tabindex', '0'); // make focusable
  taskSpan.setAttribute('role', 'button');
  taskSpan.setAttribute('aria-pressed', completed ? 'true' : 'false');

  // Toggle complete on click or keypress
  function toggleComplete() {
    li.classList.toggle('completed');
    const isCompleted = li.classList.contains('completed');
    taskSpan.setAttribute('aria-pressed', isCompleted ? 'true' : 'false');
    saveTasks();
  }

  taskSpan.addEventListener('click', toggleComplete);
  taskSpan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleComplete();
    }
  });

  // Delete card + button
  const deleteCard = document.createElement('div');
  deleteCard.classList.add('delete-card');

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button'; // prevent form submission
  deleteBtn.textContent = '✖';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.setAttribute('aria-label', 'Delete task');

  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  deleteCard.appendChild(deleteBtn);
  li.appendChild(taskSpan);
  li.appendChild(deleteCard);
  if (completed) li.classList.add('completed');
  list.appendChild(li);

  // Drag events
  li.addEventListener('dragstart', () => li.classList.add('dragging'));
  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    saveTasks();
  });

  saveTasks();
}

// Save tasks
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

// Load tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Drag & drop reordering
list.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(list, e.clientY);
  const dragging = document.querySelector('.dragging');
  if (dragging) {
    if (afterElement == null) {
      list.appendChild(dragging);
    } else {
      list.insertBefore(dragging, afterElement);
    }
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Dark mode toggle
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'darkMode',
    document.body.classList.contains('dark') ? 'enabled' : 'disabled'
  );
});