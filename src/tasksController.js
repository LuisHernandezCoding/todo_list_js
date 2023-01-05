// Task is a model that represents a task
// id:int
// project:project
// name:string
// description:string
// dueDate:date
// created:date
// completed:date
// lastModified:date
// category:string (personal, work, home)
// priority:int (1:urgent, 2:important, 3:low priority)

// Validate task params
function validate(params, project) {
  if (params.name === '') {
    alert('Task name is required');
    return false;
  }
  if (params.description === '') {
    alert('Task description is required');
    return false;
  }
  if (params.dueDate === '') {
    alert('Task due date is required');
    return false;
  }
  if (params.category === '') {
    alert('Task category is required');
    return false;
  }
  if (params.priority === '') {
    alert('Task priority is required');
    return false;
  }
  if (project === null) {
    alert('Project is required');
    return false;
  }
  if (project.tasks.find((t) => t.name === params.name)) {
    alert('Task name already exists');
    return false;
  }
  return true;
}

// Create a new task
export function createTask(params, project) {
  if (validate(params, project)) {
    const date = new Date();
    const task = {
      id: date.getTime(),
      project: project.name,
      name: params.name,
      description: params.description,
      dueDate: params.dueDate,
      created: date,
      completed: null,
      lastModified: date,
      category: params.category,
      priority: params.priority,
    };
    project.tasks.push(task);
    return true;
  }
  return false;
}

// Get all tasks
export function getTasks(project) {
  return project.tasks;
}

// Delete a task
export function deleteTask(task, project) {
  const index = project.tasks.findIndex((t) => t.id === task.id);
  project.tasks.splice(index, 1);
}

function checkTasksCompleted(project) {
  const tasksCompletedSubtitle = document.querySelector('#tasksCompletedSubtitle');
  const tasksSeparator = document.querySelector('#tasksSeparator');
  const tasksCompleted = project.tasks.filter((task) => task.completed !== null);
  const tasksPending = project.tasks.filter((task) => task.completed === null);
  const tasksCompletedList = document.querySelector('#tasksCompletedList');
  const tasksPendingList = document.querySelector('#tasksList');

  if (project.tasks.length > 0) {
    tasksCompletedSubtitle.classList.remove('is-hidden');
    tasksSeparator.classList.remove('is-hidden');
    tasksCompletedList.classList.remove('is-hidden');
    tasksPendingList.classList.remove('is-hidden');
  } else {
    tasksCompletedSubtitle.classList.add('is-hidden');
    tasksSeparator.classList.add('is-hidden');
    tasksCompletedList.classList.add('is-hidden');
    tasksPendingList.classList.add('is-hidden');
  }

  if (tasksPending.length === 0) {
    tasksPendingList.innerHTML = `
      <div class="notification is-success" id="noTasksPending">
        <p class="title is-5">No tasks pending</p>
      </div>`;
  } else {
    const noTasksPending = tasksPendingList.querySelector('#noTasksPending');
    if (noTasksPending) {
      noTasksPending.remove();
    }
  }
  if (tasksCompleted.length === 0) {
    tasksCompletedList.classList.add('is-hidden');
  } else {
    tasksCompletedList.classList.remove('is-hidden');
  }
}

// Set tasks section
export function setTasksSection(project) {
  const tasksTitle = document.querySelector('#tasksTitle');
  const tasksList = document.querySelector('#tasksList');
  const tasksCompletedList = document.querySelector('#tasksCompletedList');
  const tasksButtons = document.querySelector('#tasksButtons');

  // Task status
  tasksList.innerHTML = '';
  tasksCompletedList.innerHTML = '';

  tasksTitle.classList.remove('has-text-danger');
  tasksTitle.classList.add('has-text-info');
  tasksTitle.innerHTML = `${project.name}`;
  tasksList.classList.remove('is-hidden');
  tasksButtons.classList.remove('is-hidden');

  checkTasksCompleted(project);
  project.tasks.forEach((task) => {
    const field = document.createElement('div');
    field.classList.add('field');
    field.innerHTML = `
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            <button class="button is-small is-success is-outlined mr-2" id="btnTaskStatus">
              <span class="icon is-small">
                <i class="fa fa-check" aria-hidden="true"></i>
              </span>
            </button>
            ${task.name}
          </p>
          <button class="card-header-icon" aria-label="more options" id="btnTaskOptions">
            <span class="tag is-primary ml-2">
              <span id="cardCategory">${task.category}</span>
            </span>
            <span class="tag is-danger ml-2">
              <span id="cardPriority">${task.priority}</span>
            </span>
            <span class="tag is-grey ml-2">
              <span id="cardDueDate">${task.dueDate}</span>
            </span>
            <span class="icon">
              <i class="fa fa-angle-down is-not-rotated" aria-hidden="true"></i>
            </span>
          </a>
        </header>
      </div>
      <div class="card-content is-hidden" id="cardContent">
        <div class="content">
          <footer class="card-footer self-align-right">
            <time datetime="2016-1-1">
              Due Date: ${task.dueDate} | Created: ${task.created} | Last Modified: ${task.lastModified}
            </time>
          </footer>
        </div>
      </div>`;

    // Task description
    if (task.description !== '' || task.description !== null || task.description !== undefined) {
      const cardContent = field.querySelector('#cardContent').querySelector('.content');
      const description = document.createElement('p');
      description.classList.add('wrap-text');
      description.innerHTML = task.description;
      cardContent.insertBefore(description, cardContent.firstChild);
    }

    if (task.completed !== null) {
      // Add task to completed list
      tasksCompletedList.appendChild(field);
      const btnTaskStatus = field.querySelector('#btnTaskStatus');
      btnTaskStatus.classList.add('is-checked');
      btnTaskStatus.classList.remove('is-outlined');
    } else {
      // Add task to pending list
      tasksList.appendChild(field);
    }

    // Add a message if all tasks are completed
    if (tasksList.innerHTML === '') {
      tasksList.innerHTML = `
        <div class="content">
          <p class="title is-4 has-text-centered has-text-danger">All tasks completed</p>
        </div>`;
    }

    // Task status button
    const btnTaskOptions = field.querySelector('#btnTaskOptions');
    btnTaskOptions.addEventListener('click', () => {
      const cardContent = field.querySelector('#cardContent');
      const icon = btnTaskOptions.querySelector('.icon');
      if (cardContent.classList.contains('is-hidden')) {
        cardContent.classList.remove('is-hidden');
        cardContent.classList.remove('slide-down');
        cardContent.classList.add('slide-up');
        icon.classList.remove('is-not-rotated');
        icon.classList.add('is-rotated');
      } else {
        cardContent.classList.remove('slide-up');
        cardContent.classList.add('slide-down');
        icon.classList.remove('is-rotated');
        icon.classList.add('is-not-rotated');
        setTimeout(() => {
          cardContent.classList.add('is-hidden');
        }, 500);
      }
    });

    const btnTaskStatus = field.querySelector('#btnTaskStatus');
    const projects = JSON.parse(localStorage.getItem('projects'));
    const index = projects.findIndex((p) => p.name === project.name);
    btnTaskStatus.addEventListener('click', () => {
      if (task.completed === null) {
        task.completed = new Date();
        btnTaskStatus.classList.add('is-checked');
        btnTaskStatus.classList.remove('is-outlined');
        tasksCompletedList.appendChild(field);
        checkTasksCompleted(project);
        projects[index] = project;
        localStorage.setItem('projects', JSON.stringify(projects));
      } else {
        task.completed = null;
        btnTaskStatus.classList.remove('is-checked');
        btnTaskStatus.classList.add('is-outlined');
        tasksList.appendChild(field);
        checkTasksCompleted(project);
        projects[index] = project;
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    });
  });
}

// Reset tasks section
export function resetTasksSection() {
  const tasksTitle = document.querySelector('#tasksTitle');
  const tasksList = document.querySelector('#tasksList');
  const tasksButtons = document.querySelector('#tasksButtons');

  tasksTitle.classList.remove('has-text-info');
  tasksTitle.classList.add('has-text-danger');
  tasksTitle.innerHTML = 'No project selected';
  tasksList.classList.add('is-hidden');
  tasksButtons.classList.add('is-hidden');
}