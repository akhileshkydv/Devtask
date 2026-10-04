import { store } from '../store.js';

export function renderBoardView(container) {
  const tasks = store.getAll();
  const searchQuery = (document.getElementById('globalSearch')?.value || '').toLowerCase().trim();
  const priorityFilter = document.getElementById('priorityFilter')?.value || 'ALL';

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchQuery) || 
                        task.description.toLowerCase().includes(searchQuery) ||
                        task.tags.some(tag => tag.toLowerCase().includes(searchQuery));
    const matchPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const columns = [
    { key: 'todo', label: 'To Do', accent: 'border-slate-600' },
    { key: 'in_progress', label: 'In Progress', accent: 'border-amber-500' },
    { key: 'review', label: 'Code Review', accent: 'border-indigo-500' },
    { key: 'done', label: 'Completed', accent: 'border-emerald-500' }
  ];

  const html = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 h-full items-start">
      ${columns.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col.key);
        return `
          <div class="bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col max-h-[calc(100vh-140px)]">
            <div class="p-3.5 border-b ${col.accent} border-b-2 flex items-center justify-between">
              <span class="font-bold text-sm text-slate-200 tracking-wide">${col.label}</span>
              <span class="text-xs bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full">${colTasks.length}</span>
            </div>
            
            <div class="p-3 space-y-3 overflow-y-auto flex-1 kanban-drop-zone min-h-[350px]" data-status="${col.key}">
              ${colTasks.map(task => renderCard(task)).join('')}${colTasks.length === 0 ? `<div class="text-xs text-slate-600 text-center py-10 font-medium">Drop tasks here</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
  attachBoardEvents(container);
}

function renderCard(task) {
  const priorityStyles = {
    Low: 'text-slate-400 bg-slate-800/80 border-slate-700',
    Medium: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    High: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Critical: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  };

  return `
    <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-slate-700 transition shadow-sm"
         draggable="true" 
         data-task-id="${task.id}">
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="text-[11px] font-mono font-semibold text-slate-500">${task.id}</span>
        <span class="text-[11px] font-semibold px-2 py-0.5 rounded border ${priorityStyles[task.priority]}">${task.priority}</span>
      </div>
      <h4 class="text-sm font-semibold text-slate-100 mb-1 leading-snug">${escape(task.title)}</h4>
      <p class="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">${escape(task.description)}</p>
      
      <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div class="flex flex-wrap gap-1">
          ${task.tags.map(tag => `<span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">${escape(tag)}</span>`).join('')}
        </div>
        <button class="delete-task-btn text-slate-500 hover:text-rose-400 text-xs transition" data-id="${task.id}" title="Delete">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>
  `;
}

function escape(str) {
  return (str || '').replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function attachBoardEvents(container) {
  // Drag and Drop implementation
  const cards = container.querySelectorAll('[draggable="true"]');
  const dropZones = container.querySelectorAll('.kanban-drop-zone');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.getAttribute('data-task-id'));
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const taskId = e.dataTransfer.getData('text/plain');
      const targetStatus = zone.getAttribute('data-status');
      if (taskId && targetStatus) {
        store.updateStatus(taskId, targetStatus);
      }
    });
  });

  // Delete button handling
  container.querySelectorAll('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete ${id}?`)) {
        store.delete(id);
      }
    });
  });
}