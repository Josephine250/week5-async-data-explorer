/**
 * Generic fetch helper that checks response status and returns parsed JSON.
 * @param {string} url 
 * @returns {Promise<any>}
 */
export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText || 'Failed to fetch'})`);
  }
  return await response.json();
}

/**
 * Executes parallel requests using Promise.all to fetch recipes and tags/cuisines.
 * @returns {Promise<{recipes: Array, tags: Array}>}
 */
export async function fetchInitialData() {
  const [recipesRes, tagsRes] = await Promise.all([
    getJSON('https://dummyjson.com/recipes?limit=50'),
    getJSON('https://dummyjson.com/recipes/tags')
  ]);

  return {
    recipes: recipesRes.recipes,
    tags: tagsRes
  };
}

/**
 * Fetches single recipe details by ID.
 * @param {number|string} id 
 * @returns {Promise<Object>}
 */
export async function fetchRecipeById(id) {
  return await getJSON(`https://dummyjson.com/recipes/${id}`);
}