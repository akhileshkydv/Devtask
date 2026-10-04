import { store } from '../store.js';

export function renderAnalyticsView(container) {
  const tasks = store.getAll();
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const review = tasks.filter(t => t.status === 'review').length;
  const todo = tasks.filter(t => t.status === 'todo').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- High Level KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Total Issues</div>
          <div class="text-3xl font-extrabold text-white">${total}</div>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">In Flight</div>
          <div class="text-3xl font-extrabold text-amber-400">${inProgress + review}</div>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Completed</div>
          <div class="text-3xl font-extrabold text-emerald-400">${completed}</div>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Sprint Completion</div>
          <div class="text-3xl font-extrabold text-indigo-400">${completionRate}%</div>
        </div>
      </div>

      <!-- Visual Metric Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 class="text-sm font-bold text-white mb-4">Sprint Pipeline Distribution</h3>
          <div class="space-y-4 text-xs">
            <div>
              <div class="flex justify-between mb-1 text-slate-300"><span>To Do</span><span>${todo}</span></div>
              <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div class="bg-slate-500 h-full" style="width: ${total ? (todo/total)*100 : 0}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-amber-300"><span>In Progress</span><span>${inProgress}</span></div>
              <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div class="bg-amber-400 h-full" style="width: ${total ? (inProgress/total)*100 : 0}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-indigo-300"><span>Code Review</span><span>${review}</span></div>
              <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div class="bg-indigo-500 h-full" style="width: ${total ? (review/total)*100 : 0}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-emerald-300"><span>Done</span><span>${completed}</span></div>
              <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full" style="width: ${total ? (completed/total)*100 : 0}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-white mb-2">Engineering Velocity Assessment</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Based on the active backlog items, your pipeline maintains <strong>${inProgress} concurrent tasks in progress</strong>. 
              The target ratio for high sprint throughput is keeping fewer than 4 active tasks per team member.
            </p>
          </div>
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
            <i class="fa-solid fa-lightbulb text-indigo-400 mr-1.5"></i>
            <strong>Interview Tip:</strong> Mention how tracking throughput and completion rates helps software teams identify bottlenecks during Code Review.
          </div>
        </div>
      </div>
    </div>
  `;
}