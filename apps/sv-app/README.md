# Tu Svelte app

Sveltekit app template from **Tu**

## Setup steps

- Copy tu-sv-tool folder to root directory
- Copy pre-all, dev, and build scripts from package.json
- Copy src/routes/+error.svelte
- Create src/hooks.server.ts and export {handleError}
- Add data-theme and class="dark" to src/app.html
- Add import: **import "@repo/ui/styles/all.scss";import "@flaticon/flaticon-uicons/css/all/all.css";** to **src/routes/+layout.svelte**