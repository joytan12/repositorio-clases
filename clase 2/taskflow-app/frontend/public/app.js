// Configuración de la URL base del API
// En Docker con Nginx: usa la ruta relativa '/api'
// Si se ejecuta de forma local independiente: recurre a 'http://localhost:5000/api'
const API_BASE = window.location.port === '5000' || window.location.port === '80' || window.location.port === ''
  ? '/api'
  : 'http://localhost:5000/api';

// Estado global de la aplicación
const state = {
  tasks: [],
  categories: [],
  stats: null,
  filters: {
    status: 'todas',
    category_id: 'todas',
    priority: 'todas',
    search: '',
  },
  selectedApiEndpoint: 'getTasks',
};

// Definición de Endpoints para el Explorador Interactivo
const ENDPOINTS_DEF = {
  health: {
    method: 'GET',
    path: '/api/health',
    desc: 'Verifica la salud del servicio backend y la latencia hacia PostgreSQL.',
    hasBody: false,
    defaultBody: '',
  },
  stats: {
    method: 'GET',
    path: '/api/stats',
    desc: 'Devuelve métricas agregadas: total, pendientes, en progreso, completadas y distribución por categoría.',
    hasBody: false,
    defaultBody: '',
  },
  getTasks: {
    method: 'GET',
    path: '/api/tasks',
    desc: 'Obtiene el listado de tareas. Acepta query params opcionales: ?status=...&priority=...&category_id=...&search=...',
    hasBody: false,
    defaultBody: '',
  },
  getTaskById: {
    method: 'GET',
    path: '/api/tasks/1',
    desc: 'Obtiene los datos completos de una tarea específica según su ID.',
    hasBody: false,
    defaultBody: '',
  },
  createTask: {
    method: 'POST',
    path: '/api/tasks',
    desc: 'Crea una nueva tarea en la base de datos.',
    hasBody: true,
    defaultBody: JSON.stringify({
      title: 'Prueba desde API Explorer',
      description: 'Tarea creada mediante llamada REST directa.',
      category_id: 1,
      priority: 'alta',
      due_date: new Date().toISOString().split('T')[0],
    }, null, 2),
  },
  updateTask: {
    method: 'PUT',
    path: '/api/tasks/1',
    desc: 'Actualiza completamente los datos de una tarea por su ID.',
    hasBody: true,
    defaultBody: JSON.stringify({
      title: 'Tarea 1 (Actualizada)',
      description: 'Descripción modificada con PUT.',
      category_id: 1,
      priority: 'media',
      status: 'en_progreso',
    }, null, 2),
  },
  patchStatus: {
    method: 'PATCH',
    path: '/api/tasks/1/status',
    desc: 'Actualiza únicamente el estado de la tarea (pendiente | en_progreso | completada).',
    hasBody: true,
    defaultBody: JSON.stringify({
      status: 'completada',
    }, null, 2),
  },
  deleteTask: {
    method: 'DELETE',
    path: '/api/tasks/999',
    desc: 'Elimina una tarea de la base de datos por su ID.',
    hasBody: false,
    defaultBody: '',
  },
  getCategories: {
    method: 'GET',
    path: '/api/categories',
    desc: 'Lista todas las categorías con el conteo de tareas asociadas.',
    hasBody: false,
    defaultBody: '',
  },
  createCategory: {
    method: 'POST',
    path: '/api/categories',
    desc: 'Registra una nueva categoría en el sistema.',
    hasBody: true,
    defaultBody: JSON.stringify({
      name: 'Nueva Categoría API',
      color: '#8b5cf6',
    }, null, 2),
  },
  seedData: {
    method: 'POST',
    path: '/api/seed',
    desc: 'Reinicializa la base de datos con los datos de ejemplo iniciales.',
    hasBody: false,
    defaultBody: '',
  },
};

// Elementos DOM
const dom = {
  dbStatusBadge: document.getElementById('dbStatusBadge'),
  dbStatusText: document.getElementById('dbStatusText'),
  statTotal: document.getElementById('statTotal'),
  statPending: document.getElementById('statPending'),
  statProgress: document.getElementById('statProgress'),
  statCompleted: document.getElementById('statCompleted'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  chips: document.querySelectorAll('.chip'),
  categoryFilter: document.getElementById('categoryFilter'),
  priorityFilter: document.getElementById('priorityFilter'),
  btnReload: document.getElementById('btnReload'),
  btnNewTask: document.getElementById('btnNewTask'),
  tasksLoading: document.getElementById('tasksLoading'),
  tasksEmpty: document.getElementById('tasksEmpty'),
  tasksGrid: document.getElementById('tasksGrid'),
  btnResetSeed: document.getElementById('btnResetSeed'),
  btnSeedDataFooter: document.getElementById('btnSeedDataFooter'),
  // Modales
  taskModal: document.getElementById('taskModal'),
  taskForm: document.getElementById('taskForm'),
  modalTitle: document.getElementById('modalTitle'),
  taskId: document.getElementById('taskId'),
  taskTitle: document.getElementById('taskTitle'),
  taskDescription: document.getElementById('taskDescription'),
  taskCategory: document.getElementById('taskCategory'),
  taskPriority: document.getElementById('taskPriority'),
  taskStatus: document.getElementById('taskStatus'),
  taskDueDate: document.getElementById('taskDueDate'),
  btnCloseModal: document.getElementById('btnCloseModal'),
  btnCancelModal: document.getElementById('btnCancelModal'),
  // Categoría Modal
  btnOpenNewCategory: document.getElementById('btnOpenNewCategory'),
  categoryModal: document.getElementById('categoryModal'),
  categoryForm: document.getElementById('categoryForm'),
  categoryName: document.getElementById('categoryName'),
  categoryColor: document.getElementById('categoryColor'),
  colorHexLabel: document.getElementById('colorHexLabel'),
  btnCloseCatModal: document.getElementById('btnCloseCatModal'),
  btnCancelCatModal: document.getElementById('btnCancelCatModal'),
  // API Explorer
  btnOpenApiDocs: document.getElementById('btnOpenApiDocs'),
  apiDocsModal: document.getElementById('apiDocsModal'),
  btnCloseApiDocs: document.getElementById('btnCloseApiDocs'),
  apiItems: document.querySelectorAll('.api-item'),
  apiSelectedMethod: document.getElementById('apiSelectedMethod'),
  apiSelectedPath: document.getElementById('apiSelectedPath'),
  apiSelectedDesc: document.getElementById('apiSelectedDesc'),
  apiPayloadContainer: document.getElementById('apiPayloadContainer'),
  apiPayloadInput: document.getElementById('apiPayloadInput'),
  btnExecuteApiCall: document.getElementById('btnExecuteApiCall'),
  apiResponseStatus: document.getElementById('apiResponseStatus'),
  apiResponseViewer: document.getElementById('apiResponseViewer'),
  // Toast
  toastContainer: document.getElementById('toastContainer'),
};

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// SERVICIO DE RED / FETCH HELPER
// ==========================================
async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.replace('/api', '')}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }
  return data;
}

// ==========================================
// CHEQUEO DE SALUD Y CONEXIÓN
// ==========================================
async function checkHealth() {
  try {
    const res = await apiFetch('/health');
    if (res.status === 'healthy' && res.database === 'connected') {
      dom.dbStatusBadge.className = 'status-badge online';
      dom.dbStatusText.textContent = `PostgreSQL: Conectado (${res.latency})`;
    } else {
      throw new Error(res.error || 'DB Desconectada');
    }
  } catch (err) {
    dom.dbStatusBadge.className = 'status-badge offline';
    dom.dbStatusText.textContent = 'BD Desconectada';
  }
}

// ==========================================
// CARGAR ESTADÍSTICAS (GET /api/stats)
// ==========================================
async function loadStats() {
  try {
    const res = await apiFetch('/stats');
    if (res.success && res.summary) {
      dom.statTotal.textContent = res.summary.total || 0;
      dom.statPending.textContent = res.summary.pendientes || 0;
      dom.statProgress.textContent = res.summary.en_progreso || 0;
      dom.statCompleted.textContent = res.summary.completadas || 0;
    }
  } catch (err) {
    console.error('Error al cargar stats:', err);
  }
}

// ==========================================
// CARGAR CATEGORÍAS (GET /api/categories)
// ==========================================
async function loadCategories() {
  try {
    const res = await apiFetch('/categories');
    if (res.success) {
      state.categories = res.data;
      renderCategoryFilters();
    }
  } catch (err) {
    console.error('Error al cargar categorías:', err);
  }
}

function renderCategoryFilters() {
  // Selector de filtro principal
  const currentFilterVal = dom.categoryFilter.value;
  dom.categoryFilter.innerHTML = '<option value="todas">Todas las categorías</option>';
  
  // Selector en modal de tarea
  dom.taskCategory.innerHTML = '<option value="">Sin categoría</option>';

  state.categories.forEach(cat => {
    const optFilter = document.createElement('option');
    optFilter.value = cat.id;
    optFilter.textContent = `${cat.name} (${cat.total_tasks || 0})`;
    dom.categoryFilter.appendChild(optFilter);

    const optModal = document.createElement('option');
    optModal.value = cat.id;
    optModal.textContent = cat.name;
    dom.taskCategory.appendChild(optModal);
  });

  dom.categoryFilter.value = currentFilterVal || 'todas';
}

// ==========================================
// CARGAR Y RENDERIZAR TAREAS (GET /api/tasks)
// ==========================================
async function loadTasks() {
  dom.tasksLoading.style.display = 'flex';
  dom.tasksEmpty.style.display = 'none';
  dom.tasksGrid.style.display = 'none';

  try {
    const params = new URLSearchParams();
    if (state.filters.status !== 'todas') params.append('status', state.filters.status);
    if (state.filters.category_id !== 'todas') params.append('category_id', state.filters.category_id);
    if (state.filters.priority !== 'todas') params.append('priority', state.filters.priority);
    if (state.filters.search.trim()) params.append('search', state.filters.search.trim());

    const res = await apiFetch(`/tasks?${params.toString()}`);
    state.tasks = res.data || [];

    dom.tasksLoading.style.display = 'none';

    if (state.tasks.length === 0) {
      dom.tasksEmpty.style.display = 'flex';
    } else {
      renderTasksGrid(state.tasks);
      dom.tasksGrid.style.display = 'grid';
    }
    loadStats();
  } catch (err) {
    dom.tasksLoading.style.display = 'none';
    dom.tasksEmpty.style.display = 'flex';
    showToast(`Error al cargar tareas: ${err.message}`, 'error');
  }
}

function renderTasksGrid(tasks) {
  dom.tasksGrid.innerHTML = '';

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.style.setProperty('--card-accent', task.category_color || '#6366f1');

    // Formatear fecha
    let formattedDate = 'Sin fecha';
    let isUrgent = false;
    if (task.due_date) {
      const d = new Date(task.due_date);
      formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today && task.status !== 'completada') {
        isUrgent = true;
      }
    }

    const statusLabels = {
      pendiente: 'Pendiente',
      en_progreso: 'En Progreso',
      completada: 'Completada',
    };

    card.innerHTML = `
      <div class="task-header">
        <div class="task-badges">
          ${task.category_name ? `
            <span class="badge-category">
              <span class="cat-dot" style="background-color: ${task.category_color};"></span>
              ${escapeHtml(task.category_name)}
            </span>
          ` : ''}
          <span class="badge-priority ${task.priority}">${task.priority}</span>
        </div>

        <button class="badge-status ${task.status}" title="Clic para cambiar estado" data-action="toggle-status" data-id="${task.id}" data-status="${task.status}">
          <span>●</span> ${statusLabels[task.status] || task.status}
        </button>
      </div>

      <div class="task-body">
        <h3 class="task-title ${task.status === 'completada' ? 'completed' : ''}">${escapeHtml(task.title)}</h3>
        ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
      </div>

      <div class="task-footer">
        <div class="due-date ${isUrgent ? 'urgent' : ''}" title="Fecha límite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${formattedDate} ${isUrgent ? '(Vencida)' : ''}</span>
        </div>

        <div class="card-actions">
          <button class="action-icon-btn edit" title="Editar tarea" data-action="edit" data-id="${task.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-icon-btn delete" title="Eliminar tarea" data-action="delete" data-id="${task.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    dom.tasksGrid.appendChild(card);
  });
}

// Ciclo rápido de estado con PATCH /api/tasks/:id/status
async function cycleTaskStatus(taskId, currentStatus) {
  const flow = {
    pendiente: 'en_progreso',
    en_progreso: 'completada',
    completada: 'pendiente',
  };
  const nextStatus = flow[currentStatus] || 'pendiente';

  try {
    await apiFetch(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    showToast(`Estado cambiado a: ${nextStatus}`, 'success');
    loadTasks();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

// Eliminar tarea con DELETE /api/tasks/:id
async function deleteTask(taskId) {
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

  try {
    await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });
    showToast('Tarea eliminada correctamente', 'info');
    loadTasks();
    loadCategories();
  } catch (err) {
    showToast(`Error al eliminar: ${err.message}`, 'error');
  }
}

// Abrir modal de edición con GET /api/tasks/:id
async function openEditTaskModal(taskId) {
  try {
    const res = await apiFetch(`/tasks/${taskId}`);
    const task = res.data;

    dom.modalTitle.textContent = 'Editar Tarea';
    dom.taskId.value = task.id;
    dom.taskTitle.value = task.title;
    dom.taskDescription.value = task.description || '';
    dom.taskCategory.value = task.category_id || '';
    dom.taskPriority.value = task.priority || 'media';
    dom.taskStatus.value = task.status || 'pendiente';
    dom.taskDueDate.value = task.due_date ? task.due_date.split('T')[0] : '';

    dom.taskModal.style.display = 'flex';
  } catch (err) {
    showToast(`Error al cargar datos de tarea: ${err.message}`, 'error');
  }
}

// Guardar Tarea (POST o PUT)
async function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = dom.taskId.value;
  const payload = {
    title: dom.taskTitle.value.trim(),
    description: dom.taskDescription.value.trim(),
    category_id: dom.taskCategory.value ? parseInt(dom.taskCategory.value, 10) : null,
    priority: dom.taskPriority.value,
    status: dom.taskStatus.value,
    due_date: dom.taskDueDate.value || null,
  };

  try {
    if (id) {
      // Actualizar PUT /api/tasks/:id
      await apiFetch(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Tarea actualizada exitosamente', 'success');
    } else {
      // Crear POST /api/tasks
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Tarea creada exitosamente', 'success');
    }
    dom.taskModal.style.display = 'none';
    dom.taskForm.reset();
    loadTasks();
    loadCategories();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Crear Categoría POST /api/categories
async function handleCategoryFormSubmit(e) {
  e.preventDefault();
  const name = dom.categoryName.value.trim();
  const color = dom.categoryColor.value;

  try {
    const res = await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    showToast(`Categoría "${res.data.name}" creada`, 'success');
    dom.categoryModal.style.display = 'none';
    dom.categoryForm.reset();
    await loadCategories();
    if (dom.taskModal.style.display === 'flex') {
      dom.taskCategory.value = res.data.id;
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Reiniciar datos POST /api/seed
async function resetDemoData() {
  if (!confirm('¿Deseas restaurar la base de datos a sus datos de prueba iniciales?')) return;
  try {
    await apiFetch('/seed', { method: 'POST' });
    showToast('Base de datos restaurada con datos demo', 'success');
    await loadCategories();
    await loadTasks();
  } catch (err) {
    showToast(`Error al resembrar: ${err.message}`, 'error');
  }
}

// ==========================================
// EXPLORADOR DE API INTERACTIVO
// ==========================================
function selectEndpoint(key) {
  const item = ENDPOINTS_DEF[key];
  if (!item) return;

  state.selectedApiEndpoint = key;

  dom.apiItems.forEach(el => {
    el.classList.toggle('active', el.dataset.endpoint === key);
  });

  dom.apiSelectedMethod.className = `method-badge ${item.method.toLowerCase()}`;
  dom.apiSelectedMethod.textContent = item.method;
  dom.apiSelectedPath.value = item.path;
  dom.apiSelectedDesc.textContent = item.desc;

  if (item.hasBody) {
    dom.apiPayloadContainer.style.display = 'block';
    dom.apiPayloadInput.value = item.defaultBody;
  } else {
    dom.apiPayloadContainer.style.display = 'none';
  }

  dom.apiResponseStatus.className = 'status-chip';
  dom.apiResponseStatus.textContent = 'Listo para ejecutar';
  dom.apiResponseViewer.textContent = '// Presiona "Ejecutar Petición ⚡" para realizar la llamada real';
}

async function executeSelectedEndpoint() {
  const item = ENDPOINTS_DEF[state.selectedApiEndpoint];
  if (!item) return;

  dom.btnExecuteApiCall.disabled = true;
  dom.apiResponseStatus.textContent = 'Ejecutando...';

  try {
    const options = {
      method: item.method,
    };

    if (item.hasBody) {
      options.body = dom.apiPayloadInput.value;
    }

    const url = item.path;
    const startTime = performance.now();
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const duration = Math.round(performance.now() - startTime);
    const json = await res.json().catch(() => ({}));

    dom.apiResponseStatus.className = `status-chip ${res.ok ? 'success' : 'error'}`;
    dom.apiResponseStatus.textContent = `${res.status} ${res.statusText} (${duration}ms)`;
    dom.apiResponseViewer.textContent = JSON.stringify(json, null, 2);

    // Refrescar vistas del dashboard si hubo cambios
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(item.method)) {
      loadTasks();
      loadCategories();
    }
  } catch (err) {
    dom.apiResponseStatus.className = 'status-chip error';
    dom.apiResponseStatus.textContent = 'Error de red';
    dom.apiResponseViewer.textContent = `// Error: ${err.message}`;
  } finally {
    dom.btnExecuteApiCall.disabled = false;
  }
}

// ==========================================
// UTILIDADES
// ==========================================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Filtros de estado (Chips)
  dom.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      dom.chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filters.status = chip.dataset.status;
      loadTasks();
    });
  });

  // Selector de categoría y prioridad
  dom.categoryFilter.addEventListener('change', (e) => {
    state.filters.category_id = e.target.value;
    loadTasks();
  });
  dom.priorityFilter.addEventListener('change', (e) => {
    state.filters.priority = e.target.value;
    loadTasks();
  });

  // Búsqueda con debounce
  let debounceTimeout;
  dom.searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    dom.clearSearchBtn.style.display = val ? 'block' : 'none';
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      state.filters.search = val;
      loadTasks();
    }, 300);
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    dom.searchInput.value = '';
    dom.clearSearchBtn.style.display = 'none';
    state.filters.search = '';
    loadTasks();
  });

  dom.btnReload.addEventListener('click', () => {
    showToast('Recargando datos...', 'info');
    loadTasks();
    loadCategories();
    checkHealth();
  });

  // Acciones en la grilla de tareas (Delegación de eventos)
  dom.tasksGrid.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-action="toggle-status"]');
    if (toggleBtn) {
      cycleTaskStatus(toggleBtn.dataset.id, toggleBtn.dataset.status);
      return;
    }

    const editBtn = e.target.closest('[data-action="edit"]');
    if (editBtn) {
      openEditTaskModal(editBtn.dataset.id);
      return;
    }

    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      deleteTask(deleteBtn.dataset.id);
      return;
    }
  });

  // Modal Nueva Tarea
  dom.btnNewTask.addEventListener('click', () => {
    dom.modalTitle.textContent = 'Nueva Tarea';
    dom.taskForm.reset();
    dom.taskId.value = '';
    dom.taskPriority.value = 'media';
    dom.taskStatus.value = 'pendiente';
    dom.taskModal.style.display = 'flex';
  });

  dom.btnCloseModal.addEventListener('click', () => dom.taskModal.style.display = 'none');
  dom.btnCancelModal.addEventListener('click', () => dom.taskModal.style.display = 'none');
  dom.taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Modal Nueva Categoría
  dom.btnOpenNewCategory.addEventListener('click', () => {
    dom.categoryForm.reset();
    dom.categoryColor.value = '#6366f1';
    dom.colorHexLabel.textContent = '#6366f1';
    dom.categoryModal.style.display = 'flex';
  });

  dom.categoryColor.addEventListener('input', (e) => {
    dom.colorHexLabel.textContent = e.target.value;
  });

  dom.btnCloseCatModal.addEventListener('click', () => dom.categoryModal.style.display = 'none');
  dom.btnCancelCatModal.addEventListener('click', () => dom.categoryModal.style.display = 'none');
  dom.categoryForm.addEventListener('submit', handleCategoryFormSubmit);

  // Resembrar datos
  dom.btnResetSeed.addEventListener('click', resetDemoData);
  dom.btnSeedDataFooter.addEventListener('click', resetDemoData);

  // API Docs Modal
  dom.btnOpenApiDocs.addEventListener('click', () => {
    selectEndpoint('getTasks');
    dom.apiDocsModal.style.display = 'flex';
  });
  dom.btnCloseApiDocs.addEventListener('click', () => dom.apiDocsModal.style.display = 'none');

  dom.apiItems.forEach(item => {
    item.addEventListener('click', () => {
      selectEndpoint(item.dataset.endpoint);
    });
  });

  dom.btnExecuteApiCall.addEventListener('click', executeSelectedEndpoint);

  // Cerrar modales con clic fuera del cuadro
  window.addEventListener('click', (e) => {
    if (e.target === dom.taskModal) dom.taskModal.style.display = 'none';
    if (e.target === dom.categoryModal) dom.categoryModal.style.display = 'none';
    if (e.target === dom.apiDocsModal) dom.apiDocsModal.style.display = 'none';
  });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
async function init() {
  setupEventListeners();
  await checkHealth();
  await loadCategories();
  await loadTasks();

  // Monitoreo periódico de salud de PostgreSQL cada 10 segundos
  setInterval(checkHealth, 10000);
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', init);
