import { store } from './store.js';
import { Router } from './router.js';
import { renderBoardView } from './views/board.js';
import { renderBacklogView } from './views/backlog.js';
import { renderAnalyticsView } from './views/analytics.js';

// Setup routes
const routes = {
  board: renderBoardView,
  backlog: renderBacklogView,
  analytics: renderAnalyticsView
};

const router = new Router(routes, 'appView');

// Subscribe router view refresh whenever store updates
store.subscribe(() => {
  router.refresh();
});

// Setup Global Filters (Live debounced updates)
const globalSearch = document.getElementById('globalSearch');
const priorityFilter = document.getElementById('priorityFilter');

globalSearch.addEventListener('input', () => router.refresh());
priorityFilter.addEventListener('change', () => router.refresh());

// Modal Handling
const modal = document.getElementById('issueModal');
const openModalBtn = document.getElementById('openCreateModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const issueForm = document.getElementById('issueForm');

function toggleModal(open) {
  modal.classList.toggle('hidden', !open);
  if (open) {
    document.getElementById('formTitle').focus();
  } else {
    issueForm.reset();
  }
}

openModalBtn.addEventListener('click', () => toggleModal(true));
closeModalBtn.addEventListener('click', () => toggleModal(false));
cancelModalBtn.addEventListener('click', () => toggleModal(false));

issueForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('formTitle').value.trim();
  const description = document.getElementById('formDescription').value.trim();
  const priority = document.getElementById('formPriority').value;
  const status = document.getElementById('formStatus').value;
  const tags = document.getElementById('formTags').value.split(',');

  store.add({ title, description, priority, status, tags });
  toggleModal(false);
});

// Data Export & Import Handlers
document.getElementById('exportBtn').addEventListener('click', () => {
  const data = JSON.stringify(store.getAll(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devtask_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      store.importData(imported);
      alert('Data imported successfully!');
    } catch (err) {
      alert('Invalid JSON file format.');
    }
  };
  reader.readAsText(file);
});