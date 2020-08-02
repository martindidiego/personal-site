# My personal site

Welcome to my personal site!
It's a lightweight single page.
About my life.
That I can update.

### Run locally

To run locally, run `npm install` at the root. Next, run `npm start` which will do the following:

- Start a [BrowserSync](https://browsersync.io/) instance
- Start a watcher for any `.js`, `.sass`, and `.html` files which will reload the browser automaticlly when triggered

**Note**: Check the Node.js version specified in `.nvmrc` and make sure you're using that version. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` before installing dependencies.

### Build for production

To build the site for production, run `npm run build:site`. This will optimize and bundle all neccessary files into `dist/` to be served.
