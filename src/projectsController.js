import { setTasksSection, resetTasksSection } from './tasksController.js';

const projects = [];
const newProjectModal = document.getElementById('new-project');
const inputProjectName = newProjectModal.querySelector('#inputProjectName');
const helpProjectName = newProjectModal.querySelector('#helpProjectName');

function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjects() {
  const projectsData = JSON.parse(localStorage.getItem('projects'));
  if (projectsData) {
    projects.length = 0;
    projectsData.forEach((project) => {
      projects.push(project);
    });
  }
}

function addProject(project) {
  projects.push(project);
  saveProjects();
}

function validateProjectName(name) {
  if (name === '') {
    inputProjectName.classList.add('is-danger');
    helpProjectName.classList.remove('is-hidden');
    helpProjectName.innerHTML = '(Project name is required)';
    return false;
  }
  if (projects.find((project) => project.name === name)) {
    inputProjectName.classList.add('is-danger');
    helpProjectName.classList.remove('is-hidden');
    helpProjectName.innerHTML = '(Project name already exists)';
    return false;
  }
  inputProjectName.classList.remove('is-danger');
  helpProjectName.classList.add('is-hidden');
  helpProjectName.innerHTML = '';
  return true;
}

export function createProject(name) {
  const project = {
    name,
    tasks: [],
  };
  if (validateProjectName(name)) {
    addProject(project);
    return true;
  }
  return false;
}

export function getProjects() {
  loadProjects();
  return projects;
}

function checkIfProjectExists(name) {
  return projects.find((project) => project.name === name);
}

export function showProject(name) {
  if (checkIfProjectExists(name)) {
    const project = projects.find((project) => project.name === name);
    setTasksSection(project);
  } else {
    resetTasksSection();
    saveProjects();
  }
}

export function deleteProject(name) {
  if (checkIfProjectExists(name)) {
    const index = projects.findIndex((project) => project.name === name);
    projects.splice(index, 1);
    const tasksTitle = document.querySelector('#tasksTitle');
    if (projects.length === 0 || tasksTitle.innerHTML === name) {
      resetTasksSection();
    }
    saveProjects();
  }
}

export function renameProject(oldName, newName) {
  if (checkIfProjectExists(oldName)) {
    const project = projects.find((project) => project.name === oldName);
    project.name = newName;
    saveProjects();
  }
}

export function updateTasks(project) {
  if (checkIfProjectExists(project.name)) {
    const projectToUpdate = projects.find((p) => p.name === project.name);
    projectToUpdate.tasks = project.tasks;
    saveProjects();
  }
}
