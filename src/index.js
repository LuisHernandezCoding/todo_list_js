import './style.css';
import CreateNavbar from './navbar.js';
import './modal.js';
import { createTask } from './tasksController.js';

import {
  createProject,
  getProjects,
  deleteProject,
  showProject,
  updateTasks,
} from './projectsController.js';

const content = document.getElementById('content');
const navbar = CreateNavbar();

const tableProjectsBody = content.querySelector('#tableProjectsBody');
const newProjectModal = document.getElementById('new-project');
const btnCreateProject = newProjectModal.querySelector('#btnCreateProject');
const newTaskModal = document.getElementById('new-task');
const btnCreateTask = newTaskModal.querySelector('#btnCreateTask');

// Render all projects
function renderProjects() {
  tableProjectsBody.innerHTML = '';
  if (getProjects().length === 0) {
    tableProjectsBody.innerHTML = '<tr><td colspan="2">No projects</td></tr>';
  } else {
    getProjects().forEach((project) => {
      const row = document.createElement('tr');
      const btnDelete = document.createElement('button');
      const btnView = document.createElement('button');
      btnDelete.classList.add('button', 'is-small', 'is-danger');
      btnView.classList.add('button', 'is-small', 'is-info');
      btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
      btnView.innerHTML = '<i class="fa fa-eye"></i>';
      row.innerHTML = `
        <td>${project.name.length > 25 ? `${project.name.substring(0, 25)}...` : project.name}</td>
        <td id="projectBtns"></td>
      `;
      row.querySelector('#projectBtns').appendChild(btnView);
      row.querySelector('#projectBtns').appendChild(btnDelete);
      btnDelete.addEventListener('click', () => {
        deleteProject(project.name);
        renderProjects();
      });
      btnView.addEventListener('click', () => {
        showProject(project.name);
      });
      tableProjectsBody.appendChild(row);
    });
  }
}

// Create a new project button event listener
btnCreateProject.addEventListener('click', () => {
  const inputProjectName = newProjectModal.querySelector('#inputProjectName').value;
  if (createProject(inputProjectName)) {
    const modal = document.querySelector('.modal');
    modal.classList.remove('is-active');
    renderProjects();
    showProject(inputProjectName);
  }
});

// Create a new Task button event listener
btnCreateTask.addEventListener('click', () => {
  const inputTaskName = newTaskModal.querySelector('#inputTaskName').value;
  const inputTaskDescription = newTaskModal.querySelector('#inputTaskDescription').value;
  const inputTaskDueDate = newTaskModal.querySelector('#inputTaskDueDate').value;
  const inputTaskCategory = newTaskModal.querySelector('#inputTaskCategory').value;
  const inputTaskPriority = newTaskModal.querySelector('#inputTaskPriority').value;
  const projectName = document.querySelector('#tasksTitle').innerHTML;
  const project = getProjects().find((p) => p.name === projectName);
  const params = {
    name: inputTaskName,
    description: inputTaskDescription,
    dueDate: inputTaskDueDate,
    category: inputTaskCategory,
    priority: inputTaskPriority,
  };
  if (createTask(params, project)) {
    updateTasks(project);
    showProject(projectName);
    newTaskModal.classList.remove('is-active');
  }
});

// Clear Completed Tasks Button
const btnClearCompletedTasks = document.getElementById('btnClearCompletedTasks');
btnClearCompletedTasks.addEventListener('click', () => {
  const projectName = document.querySelector('#tasksTitle').innerHTML;
  const project = getProjects().find((p) => p.name === projectName);
  project.tasks = project.tasks.filter((task) => !task.completed);
  updateTasks(project);
  showProject(projectName);
});

// append navbar as first child
content.insertBefore(navbar, content.firstChild);
renderProjects();

if (getProjects().length > 0) {
  const project = getProjects()[0];
  showProject(project.name);
}
