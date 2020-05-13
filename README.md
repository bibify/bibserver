# Bibserver: a simple citation backend #
Bibserver is the backend server that powers [bibify](https://gitlab.com/bibify/bibify).
It exposes a simple yet powerful API for getting citations as well as source info.

For more information and documentation, visit the [wiki](https://gitlab.com/bibify/bibserver/-/wikis/home).

A production version of bibserver is available at https://bibserver.matthew-cloud.com.
If you want to host your own version, simply clone this repo (`git clone --recursive https://gitlab.com/bibify/bibserver.git`) and run `npm start` to start the server.

If you encounter any bugs and/or missing features, don't hesitate to file an issue! Go to the left sidebar and click on "Issues", then click "New Issue".
Although this repo might seem inactive at times, bugs should be fixed within a couple weeks at most.

Bibserver is powered by NodeJS+Express. Citation support is provided by citeproc-js. Books info fetching is powered by the Google Books API; website info fetching is powered by metascraper.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)