# iFIX static website

The site is built from `src/` by `build.js` into the production directory `site/`. Source files, documentation, and workflow configuration stay outside the Pages artifact.

## Build locally

Requires Node.js 18 or later:

```sh
SITE_BASE_PATH=/ifix-evaluation-demo node build.js
```

Serve the generated `site/` directory with any static HTTP server. For a root-domain deployment, omit `SITE_BASE_PATH`.

## GitHub Pages

The site is published at <https://nickspb2026.github.io/ifix-evaluation-demo/>. The workflow deploys `site/` on each push to `main`; it configures links and asset URLs for the repository's project-site path.

The request forms are demonstrational and do not submit data to a server; they generate text for the visitor to copy.
