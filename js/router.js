export class Router {
    constructor(routes, containerId) {
      this.routes = routes;
      this.container = document.getElementById(containerId);
      this.currentRoute = null;
  
      window.addEventListener('hashchange', () => this.handleRoute());
      window.addEventListener('load', () => this.handleRoute());
    }
  
    handleRoute() {
      const hash = window.location.hash.replace('#', '') || 'board';
      const viewRenderer = this.routes[hash] || this.routes['board'];
      this.currentRoute = hash;
  
      // Highlight active sidebar navigation tab
      document.querySelectorAll('#navLinks a').forEach(link => {
        if (link.getAttribute('data-route') === hash) {
          link.classList.add('bg-slate-800', 'text-white');
          link.classList.remove('text-slate-400');
        } else {
          link.classList.remove('bg-slate-800', 'text-white');
          link.classList.add('text-slate-400');
        }
      });
  
      // Render current view
      if (viewRenderer) {
        this.container.innerHTML = '';
        viewRenderer(this.container);
      }
    }
  
    refresh() {
      this.handleRoute();
    }
  }