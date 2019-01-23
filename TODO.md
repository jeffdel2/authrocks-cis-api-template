# Done

- Move as many files from `/public/` to CDN equivalents as possible
  - ☑ css/fontawesome icons
  - ☑ css/bootstrap
  - ☑ js/bootstrap
  - ☑ css/jquery
  - ☑ js/jquery
  - ☐ css/popuo-box
  - ☐ css/simpleLightbox
  - ☑ js/vue
- ☑ DRY up `/views/`
- ☑ Use as few images as possible in `/public/images` maybe move them into the Glitch "Assets" folder, or into S3?
- ☑ Consider using EJS for setup of the Okta Sign-In Widget
- ☑ Merge `app.js` and `server.js`
- ☑ Nice token viewer upon login
- ☑ Add friendly error page when the values in `.env` file are incomplete
    (If the file is empty, the page never loads)
- ☑ Fix "Second Login" button (put it behind a different page like Andrew had)
  (It's behind "Services" now)
- ☑ Get "Services" login page working again (it's a template thing)
- ☑ Add "Logout" button
- ☑ Add "Edit" link to Glitch console
- ☑ Fix "Edit me" link for "not configured" page

# TODO
- ☐ Get Token Viewer to work under all login situations
- ☐ Add Progressive Profiling functionality
- ☐ Reduce the variables needed `.env` 
- ☐ Move Express code to as few files as possible (or maybe only to what's logical)

# Lower priority
- ☐ Fix /maintenance
- ☐ DRY up routes/index.js
- ☐ Nice to have: "Click to copy" buttons for id_token and access_token JWTs
- ☐ Build UI for opening an account? (not on the critical path)
- ☐ Wrap JWT verifier around the API
- ☐ Add Hooks story to demo