# My personal site

Welcome to my personal site!
It's a lightweight single page.
About my life.
That I can update.

### Run locally

To run locally, run `npm install` at the root. Next, run `npm start` which will do the following:

- Start a watcher for SASS files
- Start a [BrowserSync](https://browsersync.io/) instance
- Start a watcher for any `.js`, `.sass`, and `.html` files which will reload the browser automaticlly when triggered

### Build for production

To build the site for production, run `npm run build`. This will optimize and bundle all neccessary files into `dist/` to be served.
