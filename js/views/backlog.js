import { store } from '../store.js';

export function renderBacklogView(container) {
  const tasks = store.getAll();
  const searchQuery = (document.getElementById('globalSearch')?.value || '').toLowerCase().trim();
  const priorityFilter = document.getElementById('priorityFilter')?.value || 'ALL';

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchQuery) ||
                        task.id.toLowerCase().includes(searchQuery) ||
                        task.tags.some(tag => tag.toLowerCase().includes(searchQuery));
    const matchPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const statusBadges = {
    todo: '<span class="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">To Do</span>',
    in_progress: '<span class="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">In Progress</span>',
    review: '<span class="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-400">Review</span>',
    done: '<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Completed</span>'
  };

  container.innerHTML = `
    <div class="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <div class="p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 class="text-base font-bold text-white">Backlog Registry</h2>
          <p class="text-xs text-slate-400">Showing ${filteredTasks.length} total active issues</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 bg-slate-900/60 font-semibold">
              <th class="py-3 px-4">Identifier</th>
              <th class="py-3 px-4">Issue Details</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Tags</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/70 text-slate-300">
            ${filteredTasks.map(task => `
              <tr class="hover:bg-slate-900/40 transition">
                <td class="py-3 px-4 font-mono text-xs text-slate-400 font-semibold">${task.id}</td>
                <td class="py-3 px-4 max-w-md">
                  <div class="font-medium text-slate-100">${task.title}</div>
                  <div class="text-xs text-slate-400 truncate">${task.description}</div>
                </td>
                <td class="py-3 px-4 text-xs">${task.priority}</td>
                <td class="py-3 px-4">${statusBadges[task.status] || task.status}</td>
                <td class="py-3 px-4">
                  <div class="flex flex-wrap gap-1">
                    ${task.tags.map(t => `<span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">${t}</span>`).join('')}
                  </div>
                </td>
                <td class="py-3 px-4 text-right">
                  <button class="delete-btn text-slate-500 hover:text-rose-400 text-xs px-2 py-1" data-id="${task.id}">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm(`Delete issue ${id}?`)) store.delete(id);
    });
  });
}