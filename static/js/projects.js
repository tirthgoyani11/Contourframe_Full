const form = document.querySelector('#project-actions');
const fileInput = document.querySelector('#project-file');
const status = document.querySelector('#project-status');
const list = document.querySelector('#project-list');

async function requestJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed (${response.status}). Try again.`);
  return response.json();
}

function validateProject(project) {
  if (!project || typeof project !== 'object' || !Array.isArray(project.sequenceItems) ||
      (project.version != null && ![1, 2].includes(project.version))) {
    throw new Error('Choose a Contourframe project JSON with a supported version and a timeline.');
  }
  return project;
}

async function createProject(name, state) {
  const project = await requestJSON('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data: state ? JSON.stringify(state) : undefined }),
  });
  location.assign(`/studio?project=${project.id}`);
}

async function openProject(action) {
  const buttons = form.querySelectorAll('button');
  buttons.forEach(button => { button.disabled = true; });
  status.textContent = 'Opening project…';
  try {
    await action();
  } catch (error) {
    status.textContent = error.message;
    buttons.forEach(button => { button.disabled = false; });
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(form).get('projectName').trim() || 'Untitled map';
  openProject(() => createProject(name));
});

document.querySelector('#open-sample').addEventListener('click', () => {
  openProject(async () => {
    const state = validateProject(await requestJSON('/static/samples/alpine-crossing.json'));
    await createProject(state.projectName, state);
  });
});

document.querySelector('#import-project').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileInput.value = '';
  if (!file) return;
  openProject(async () => {
    let json;
    try {
      json = JSON.parse(await file.text());
    } catch {
      throw new Error('Could not read this JSON file. Choose a project exported from Contourframe.');
    }
    const state = validateProject(json);
    const name = typeof state.projectName === 'string' && state.projectName.trim() ||
      file.name.replace(/\.json$/i, '') || 'Imported map';
    await createProject(name, state);
  });
});

requestJSON('/api/projects').then(projects => {
  if (!projects.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No saved projects yet.';
    list.append(empty);
    return;
  }
  for (const project of projects) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/studio?project=${project.id}`;
    link.textContent = project.name;
    item.append(link);
    list.append(item);
  }
}).catch(error => { status.textContent = error.message; });
