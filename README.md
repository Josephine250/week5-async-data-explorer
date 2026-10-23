Recipe Explorer - Async Data Explorer Application

Author: Josephine Niyompano  
Course: Advanced Frontend Web Development (Week 5 Assignment)  
API Endpoint: https://dummyjson.com/docs/recipes  
Live Site:   https://week5-async-data-explorer-chi.vercel.app/
 



 Project Overview

Recipe Explorer is a responsive single-page web application built with plain JavaScript (ES Modules) and Tailwind CSS. The app asynchronously fetches data from the DummyJSON Recipes API and allows users to search, filter by tag or cuisine, sort by various criteria, view detailed nutritional and preparation instructions in a modal view, and observe computed metrics in real time.



 Feature Checklist

 Fetch on Load: Loads recipe data automatically upon opening using async/await.
  Reusable API Helper: Uses getJSON(url) in src/api.js to inspect response.ok and throw clear HTTP status errors.
  Parallel API Requests: Executes concurrent HTTP calls (/recipes and /recipes/tags) using Promise.all().
  Loading State: Renders animated 8-card skeleton placeholders (animate-pulse) while awaiting network responses.
  Error State & Retry: Displays a user-friendly error message with a working Retry button when network calls fail.
 Empty State: Shows a dedicated message when search or filter combinations yield zero results.
 Responsive Card Grid: Implements a CSS grid layout adapting dynamically from 1 to 4 columns across mobile, tablet, and desktop viewports.
 Case-Insensitive Search: Real-time text filtering against recipe titles, cuisines, and ingredient lists.
 Category Filter: Dynamic dropdown menu populated directly from API category tags.
  Immutable Sorting: Provides four sorting options using Array.prototype.toSorted() to maintain original data immutability.
  Details Modal: Clicking any recipe opens a native HTML dialog element that fetches single item details by ID (/recipes/:id).
 Computed Statistics: Uses Array.prototype.reduce() to calculate total displayed items, average calorie counts, and average ratings dynamically.
  XSS Defense: Integrates a custom escapeHTML() helper to sanitize dynamic API strings before inserting them into template literals.
 Bonus Feature (+5): Debounced Search - Implements a 300ms debounce wrapper on the search input to minimize unnecessary state recalculations while typing.


 State Architecture & State to Render Flow

 Single Source of Truth (state)
The application is driven by a single global state object:

javascript
const state = {
  items: [],             // All recipe objects retrieved from API
  tags: [],              // Unique category tags retrieved from API
  status: 'loading',     // Current UI state: 'loading' | 'success' | 'error'
  errorMessage: '',      // Stores error status message if fetch fails
  query: '',             // User input search string
  filter: 'all',         // Selected category/tag filter
  sort: 'default',       // Selected sorting order
  activeModalItem: null, // Selected recipe object displayed in modal
  modalLoading: false    // Loading indicator state for single item modal fetch
};
screenshoot parts
showing error 
<img width="896" height="431" alt="image" src="https://github.com/user-attachments/assets/cb83f960-6e28-439a-a39e-38389831bd3e" />

 showing loading 
 <img width="880" height="435" alt="Screenshot 2026-10-23 163552" src="https://github.com/user-attachments/assets/a83bb1d8-5c2e-46af-8341-606856d878ea" />

