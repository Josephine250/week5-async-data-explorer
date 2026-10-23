import { escapeHTML, getVisibleItems, computeStats } from './utilis.js';

const app = document.getElementById('app');

export function render(state, handlers) {
  app.innerHTML = `
    <!-- Top Bar Header -->
    <header class="bg-amber-600 text-white p-6 shadow-md">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Recipe Explorer</h1>
          
        </div>
        ${state.status === 'success' ? renderStatsBar(state) : ''}
      </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
      <!-- 1. STATIC HERO SECTION -->
      ${renderHeroSection()}

      <!-- 2. SEARCH / FILTER / SORT CONTROLS -->
      ${state.status === 'success' ? renderControls(state) : ''}
      
      <!-- 3. RECIPE CARDS GRID -->
      <section aria-live="polite" id="content-region">
        ${renderContent(state)}
      </section>

      <!-- 4. STATIC FEATURES HIGHLIGHTS -->
      ${renderWhyChooseUs()}

      <!-- 5. STATIC SUBSCRIBE & CONTACT SECTION -->
      ${renderSubscribeSection()}
    </main>

    <!-- 6. STATIC FOOTER -->
    ${renderFooter()}

    <!-- 7. MODAL DIALOG -->
    ${renderModal(state)}
  `;

  bindEvents(state, handlers);
}

// Static Hero Banner Component
function renderHeroSection() {
  return `
    <section class="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-2xl p-8 md:p-12 mb-8 shadow-md">
      <div class="max-w-3xl">
        <span class="bg-amber-900/50 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Discover and Cook
        </span>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-3 mb-4 leading-tight">
          Explore Delicious Recipes From Around the World
        </h2>
        <p class="text-amber-100 text-base md:text-lg mb-6 leading-relaxed">
          Browse through our curated collection of quick meals, traditional cuisines, and healthy dining ideas. Search by ingredients or filter by cooking time in seconds.
        </p>
        <div class="flex flex-wrap gap-3 text-xs md:text-sm font-medium">
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">50+ Tested Recipes</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">Fast Prep Times</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">Calorie Tracking</span>
        </div>
      </div>
    </section>
  `;
}

// Static Stats Bar Component
function renderStatsBar(state) {
  const visibleItems = getVisibleItems(state);
  const stats = computeStats(visibleItems);

  return `
    <div class="bg-amber-700 p-3 rounded-lg flex gap-6 text-sm">
      <div><span class="block text-amber-200 text-xs">Shown</span><strong>${stats.totalCount}</strong> recipes</div>
      <div><span class="block text-amber-200 text-xs">Avg Calories</span><strong>${stats.avgCalories} kcal</strong></div>
      <div><span class="block text-amber-200 text-xs">Avg Rating</span><strong>${stats.avgRating} / 5</strong></div>
    </div>
  `;
}

// Search / Filter Controls Component
function renderControls(state) {
  return `
    <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="search-input" class="block text-xs font-semibold uppercase text-gray-500 mb-1">Search</label>
        <input 
          id="search-input" 
          type="search" 
          placeholder="Search recipes or ingredients..." 
          value="${escapeHTML(state.query)}"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div class="w-full sm:w-48">
        <label for="filter-select" class="block text-xs font-semibold uppercase text-gray-500 mb-1">Tag / Cuisine</label>
        <select id="filter-select" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="all">All Tags</option>
          ${state.tags.map(tag => `
            <option value="${escapeHTML(tag)}" ${state.filter === tag ? 'selected' : ''}>
              ${escapeHTML(tag)}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="w-full sm:w-48">
        <label for="sort-select" class="block text-xs font-semibold uppercase text-gray-500 mb-1">Sort By</label>
        <select id="sort-select" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="default" ${state.sort === 'default' ? 'selected' : ''}>Default</option>
          <option value="rating-desc" ${state.sort === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
          <option value="time-asc" ${state.sort === 'time-asc' ? 'selected' : ''}>Cook Time: Shortest</option>
          <option value="calories-asc" ${state.sort === 'calories-asc' ? 'selected' : ''}>Calories: Low to High</option>
          <option value="name-asc" ${state.sort === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
        </select>
      </div>
    </div>
  `;
}

// Content Switcher Component
function renderContent(state) {
  if (state.status === 'loading') return renderSkeletons();

  if (state.status === 'error') {
    return `
      <div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center max-w-md mx-auto my-8">
        <h2 class="text-xl font-bold mb-2">Error Loading Recipes</h2>
        <p class="text-sm mb-4">${escapeHTML(state.errorMessage)}</p>
        <button id="retry-btn" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition">
          Retry Request
        </button>
      </div>
    `;
  }

  const visibleItems = getVisibleItems(state);

  if (visibleItems.length === 0) {
    return `
      <div class="bg-gray-50 border border-gray-200 p-12 rounded-lg text-center my-8">
        <p class="text-gray-600 text-lg mb-2">No recipes found matching your search.</p>
        <p class="text-gray-400 text-sm">Try searching for a different ingredient or clearing filters.</p>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${visibleItems.map(item => `
        <article class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
          <img 
            src="${escapeHTML(item.image)}" 
            alt="${escapeHTML(item.name)}" 
            class="w-full h-48 object-cover bg-gray-100"
            loading="lazy"
          />
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                ${escapeHTML(item.cuisine)}
              </span>
              <span class="text-xs font-medium text-gray-500">
                ${item.prepTimeMinutes + item.cookTimeMinutes} mins
              </span>
            </div>
            <h2 class="font-bold text-gray-800 text-lg leading-snug mb-2 flex-1">
              ${escapeHTML(item.name)}
            </h2>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <span class="text-sm font-semibold text-gray-700">Rating: ${escapeHTML(item.rating)} (${escapeHTML(item.reviewCount)})</span>
              <button 
                data-id="${escapeHTML(item.id)}" 
                class="details-btn bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="View recipe for ${escapeHTML(item.name)}"
              >
                View Recipe
              </button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// Skeleton Loader Component
function renderSkeletons() {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${Array(8).fill(0).map(() => `
        <div class="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div class="w-full h-40 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-full mt-auto"></div>
        </div>
      `).join('')}
    </div>
  `;
}

// Static Feature Highlights Component
function renderWhyChooseUs() {
  return `
    <section class="my-12">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Why Cook With Us?</h2>
        <p class="text-gray-500 text-sm mt-1">Everything you need to plan your daily meals effortlessly</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <h3 class="font-bold text-gray-800 text-lg mb-2">Instant Search</h3>
          <p class="text-gray-600 text-sm">Find recipes immediately by searching for any ingredient sitting in your pantry.</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <h3 class="font-bold text-gray-800 text-lg mb-2">Nutritional Info</h3>
          <p class="text-gray-600 text-sm">Track your intake with precise calorie counts and serving sizes for every dish.</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <h3 class="font-bold text-gray-800 text-lg mb-2">Step-by-Step</h3>
          <p class="text-gray-600 text-sm">Clear preparation instructions and complete ingredient checklists inside detailed modals.</p>
        </div>
      </div>
    </section>
  `;
}

// Static Subscribe and Contact Component
function renderSubscribeSection() {
  return `
    <section class="bg-amber-700 text-white rounded-2xl p-8 md:p-12 my-12 shadow-lg text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-extrabold mb-3">Join Our Culinary Community</h2>
        <p class="text-amber-100 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Get weekly hand-picked recipes, cooking tips, and seasonal meal plans delivered straight to your inbox.
        </p>

        <form onsubmit="event.preventDefault();" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10">
          <input 
            type="email" 
            placeholder="Enter your email address..." 
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none"
          />
          <button 
            type="button" 
            class="bg-amber-900 hover:bg-amber-950 text-white font-semibold px-6 py-3 rounded-lg text-sm transition"
          >
            Subscribe
          </button>
        </form>

        <div class="border-t border-amber-600/60 pt-6 flex flex-wrap justify-center gap-6 text-amber-100 text-xs md:text-sm">
          <span>Email: support@recipeexplorer.com</span>
          <span>Location: Kigali, Rwanda</span>
        </div>
      </div>
    </section>
  `;
}

// Static Footer Component
function renderFooter() {
  return `
    <footer class="bg-gray-900 text-gray-400 py-10 px-6 mt-16 border-t border-gray-800">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h3 class="text-white font-bold text-lg">Recipe Explorer</h3>
          <p class="text-xs text-gray-400 mt-1">Advanced Frontend Web Development - Week 5 Assignment</p>
        </div>
        <div class="text-xs text-gray-500">
          Developed by Josephine Niyompano - Kigali, Rwanda
        </div>
      </div>
    </footer>
  `;
}

// Modal Component
function renderModal(state) {
  if (!state.activeModalItem && !state.modalLoading) return '';

  return `
    <dialog id="details-dialog" class="backdrop:bg-black/50 rounded-lg shadow-xl p-0 max-w-2xl w-full m-auto overflow-hidden">
      <div class="p-6 bg-white relative max-h-[90vh] overflow-y-auto">
        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        ${state.modalLoading ? `
          <div class="p-8 text-center animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div class="h-48 bg-gray-200 rounded mb-4"></div>
          </div>
        ` : `
          <div class="flex flex-col gap-4">
            <img src="${escapeHTML(state.activeModalItem.image)}" alt="${escapeHTML(state.activeModalItem.name)}" class="w-full h-56 object-cover rounded bg-gray-50" />
            
            <div>
              <span class="text-xs font-semibold text-amber-600 uppercase">${escapeHTML(state.activeModalItem.cuisine)} - ${escapeHTML(state.activeModalItem.difficulty)}</span>
              <h3 class="text-2xl font-bold text-gray-900 mb-1">${escapeHTML(state.activeModalItem.name)}</h3>
              <p class="text-sm text-gray-500 mb-4">Calories: ${escapeHTML(state.activeModalItem.caloriesPerServing)} kcal / serving</p>
              
              <h4 class="font-bold text-gray-800 text-sm border-b pb-1 mb-2">Ingredients</h4>
              <ul class="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                ${state.activeModalItem.ingredients.map(ing => `<li>${escapeHTML(ing)}</li>`).join('')}
              </ul>

              <h4 class="font-bold text-gray-800 text-sm border-b pb-1 mb-2">Instructions</h4>
              <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
                ${state.activeModalItem.instructions.map(inst => `<li>${escapeHTML(inst)}</li>`).join('')}
              </ol>
            </div>
          </div>
        `}
      </div>
    </dialog>
  `;
}

// Event Binder
function bindEvents(state, handlers) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', handlers.onSearch);

  const filterSelect = document.getElementById('filter-select');
  if (filterSelect) filterSelect.addEventListener('change', handlers.onFilter);

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.addEventListener('change', handlers.onSort);

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', handlers.onRetry);

  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handlers.onOpenModal(e.currentTarget.getAttribute('data-id'));
    });
  });

  const dialog = document.getElementById('details-dialog');
  if (dialog) {
    dialog.showModal();
    const closeBtn = document.getElementById('close-modal-btn');
    closeBtn?.addEventListener('click', handlers.onCloseModal);
    dialog.addEventListener('close', handlers.onCloseModal);
  }
}