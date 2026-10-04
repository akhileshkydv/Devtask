// Central reactive state container with persistent LocalStorage and change notifications
class TaskStore {
    constructor() {
      this.storageKey = 'devtask_pro_tasks_v1';
      this.listeners = [];
      this.tasks = this.loadInitialTasks();
    }
  
    loadInitialTasks() {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          console.error('Failed to parse local storage records, falling back to seed data.');
        }
      }
      // Realistic initial seed data for immediate demonstration
      return [
        {
          id: 'TASK-101',
          title: 'Migrate user session tokens to HTTP-only secure cookies',
          description: 'Mitigate XSS vulnerabilities by decoupling JWT storage from browser local storage.',
          priority: 'Critical',
          status: 'in_progress',
          tags: ['Security', 'Backend'],
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'TASK-102',
          title: 'Refactor Tailwind components for atomic design consistency',
          description: 'Standardize badge, button, and input form primitives across all dashboard views.',
          priority: 'Medium',
          status: 'done',
          tags: ['Frontend', 'UI/UX'],
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'TASK-103',
          title: 'Implement debounced dynamic search filter',
          description: 'Reduce unnecessary re-renders on the backlog table when searching long datasets.',
          priority: 'High',
          status: 'todo',
          tags: ['Performance', 'JavaScript'],
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 'TASK-104',
          title: 'Audit REST API response payloads for redundant entity attributes',
          description: 'Review serialize responses to keep transfer payloads under 15kb.',
          priority: 'Low',
          status: 'review',
          tags: ['API', 'Optimization'],
          updatedAt: new Date().toISOString()
        }
      ];
    }
  
    save() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
      this.notify();
    }
  
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    notify() {
      this.listeners.forEach(fn => fn(this.tasks));
    }
  
    getAll() {
      return [...this.tasks];
    }
  
    add(taskData) {
      const newTask = {
        id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        title: taskData.title,
        description: taskData.description || 'No detailed description provided.',
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'todo',
        tags: taskData.tags ? taskData.tags.map(t => t.trim()).filter(Boolean) : ['General'],
        updatedAt: new Date().toISOString()
      };
      this.tasks.unshift(newTask);
      this.save();
      return newTask;
    }
  
    update(id, updates) {
      this.tasks = this.tasks.map(task => {
        if (task.id === id) {
          return { ...task, ...updates, updatedAt: new Date().toISOString() };
        }
        return task;
      });
      this.save();
    }
  
    delete(id) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.save();
    }
  
    updateStatus(id, newStatus) {
      this.update(id, { status: newStatus });
    }
  
    importData(importedArray) {
      if (Array.isArray(importedArray)) {
        this.tasks = importedArray;
        this.save();
      }
    }
  }
  
  export const store = new TaskStore();