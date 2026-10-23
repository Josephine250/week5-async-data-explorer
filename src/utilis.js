/**
 * Prevents XSS when inserting dynamic text inside template literals.
 * @param {string|number} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Pure function to filter and sort recipes based on state.
 * @param {Object} state 
 * @returns {Array}
 */
export function getVisibleItems(state) {
  let result = [...state.items];

  // 1. Search Filter (by title, cuisine, or ingredients)
  if (state.query.trim() !== '') {
    const q = state.query.toLowerCase().trim();
    result = result.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.cuisine.toLowerCase().includes(q) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }

  // 2. Tag / Cuisine Filter
  if (state.filter !== 'all') {
    result = result.filter(item => 
      item.tags.includes(state.filter) || item.cuisine === state.filter
    );
  }

  // 3. Sorting using toSorted (Preserves immutability)
  if (state.sort === 'time-asc') {
    result = result.toSorted((a, b) => (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes));
  } else if (state.sort === 'rating-desc') {
    result = result.toSorted((a, b) => b.rating - a.rating);
  } else if (state.sort === 'calories-asc') {
    result = result.toSorted((a, b) => a.caloriesPerServing - b.caloriesPerServing);
  } else if (state.sort === 'name-asc') {
    result = result.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

/**
 * Calculates summary statistics using Array.reduce().
 * @param {Array} items 
 * @returns {Object}
 */
export function computeStats(items) {
  if (items.length === 0) {
    return { totalCount: 0, avgCalories: 0, avgRating: 0 };
  }

  const totals = items.reduce((acc, item) => {
    acc.calories += item.caloriesPerServing;
    acc.rating += item.rating;
    return acc;
  }, { calories: 0, rating: 0 });

  return {
    totalCount: items.length,
    avgCalories: Math.round(totals.calories / items.length),
    avgRating: (totals.rating / items.length).toFixed(1)
  };
}

/**
 * Debounce utility function for input handling.
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function}
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}