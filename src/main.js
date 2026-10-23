import { fetchInitialData, fetchRecipeById } from './api.js';
import { render } from './render.js';
import { debounce } from './utilis.js';

// Application State
const state = {
  items: [],
  tags: [],
  status: 'loading', // 'loading' | 'success' | 'error'
  errorMessage: '',
  query: '',
  filter: 'all',
  sort: 'default',
  activeModalItem: null,
  modalLoading: false
};

const handlers = {
  onSearch: debounce((e) => {
    state.query = e.target.value;
    updateAndRender();
  }, 300),

  onFilter: (e) => {
    state.filter = e.target.value;
    updateAndRender();
  },

  onSort: (e) => {
    state.sort = e.target.value;
    updateAndRender();
  },

  onRetry: () => {
    loadData();
  },

  onOpenModal: async (id) => {
    state.modalLoading = true;
    state.activeModalItem = null;
    updateAndRender();

    try {
      const recipe = await fetchRecipeById(id);
      state.activeModalItem = recipe;
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
      state.activeModalItem = null;
    } finally {
      state.modalLoading = false;
      updateAndRender();
    }
  },

  onCloseModal: () => {
    state.activeModalItem = null;
    state.modalLoading = false;
    updateAndRender();
  }
};

function updateAndRender() {
  render(state, handlers);
}

async function loadData() {
  state.status = 'loading';
  state.errorMessage = '';
  updateAndRender();

  try {
    const { recipes, tags } = await fetchInitialData();
    state.items = recipes;
    state.tags = tags;
    state.status = 'success';
  } catch (error) {
    state.status = 'error';
    state.errorMessage = error.message || 'An error occurred while loading recipes.';
  } finally {
    updateAndRender();
  }
}

document.addEventListener('DOMContentLoaded', loadData);