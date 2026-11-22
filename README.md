# iFIX static website

The site is built from `src/` and the root `build.js` script. Generated HTML pages and static assets are ready to publish at the repository root.

## Build locally

Requires Node.js 18 or later:

```sh
node build.js
```

Open `index.html` directly in a browser or serve this directory with any static HTTP server.

## Publish with GitHub Pages

A GitHub Actions workflow at `.github/workflows/pages.yml` builds the site on pushes to `main` and deploys it to GitHub Pages. Push this project to a GitHub repository, then in **Settings → Pages**, choose **GitHub Actions** as the build and deployment source. The first workflow run publishes the site; its URL appears in the Actions run and Pages settings.

The project currently uses root-relative page links and asset URLs, so use a user/organization site repository (`<account>.github.io`) or configure the repository as the site root. For a project site under `/<repository>/`, links/assets need a base path before publication.

The request forms are demonstrational and do not submit data to a server; they generate text for the visitor to copy.
