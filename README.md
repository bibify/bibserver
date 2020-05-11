# Bibserver: a simple citation backend #
Bibserver is the backend server that powers [bibify](https://gitlab.com/bibify/bibify).
It exposes a simple yet powerful API for getting citations as well as source info.

For more information and documentation, visit the [wiki](https://gitlab.com/bibify/bibserver/wiki).

Bibserver is powered by NodeJS+Express. Citation support is provided by citeproc-js. Books info fetching is powered by the Google Books API; website info fetching is powered by metascraper.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)