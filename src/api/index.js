import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import books from './books';
import makebib from './makebib';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

  api.get('/books', (req, res) => {
    /* Return a list of query results for a Book:
     * {
     *   type: "BOOK",
     *   title: string,
     *   author: [string, string, etc],
     *   publisher: string,
     *   date: string (ISO date),
     *   thumbnail: url,
     *   pages: int (pages),
     *   categories: [string, string, etc]
     * }
     */
    let query = req.query.q;

    books.search(query)
      .then((results) => {
        console.log(results);
        res.json(results);
      });
	});

  makebib.makeBib();
	return api;
}
