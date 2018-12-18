# TODO

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
- ☐ Move Express code to as few files as possible (or maybe only to what's logical)
- ☑ Use as few images as possible in `/public/images` maybe move them into the Glitch "Assets" folder, or into S3?
- ☐ Consider using EJS for setup of the Okta Sign-In Widget
- ☑ Merge `app.js` and `server.js`
- ☐ Fix /maintenance
- ☐ DRY up routes/index.js
- ☐ Reduce the variables needed `.env` 
- ☐ Get "Services" login page working again (it's a template thing)

# New features
- ☐ Nice token viewer upon login
- ☐ Wrap JWT verifier around the API
- ☐ Build UI for opening an account? (not on the critical path)