import { version } from '../../package.json';
import { Router } from 'express';
import shell from 'shelljs';
import Fuse from 'fuse.js';
import fs from 'fs';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import facets from './facets';
import books from './books';
import makebib from './makebib';

export default ({ config, db }) => {
	let api = Router();

  let citationStyles = getCitationStyleList();
  let typeMap = getTypeMap();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
    res.json({
      version: version,
    });
	});

  api.get('/styles', (req, res) => {
    /* Fetch a list of available styles.
     * Optional query parameter: limit=<#-of-items> (default: 20)
     */
    res.json({
      citationStyles: citationStyles.slice(0, req.query.limit || 20),
      totalStyleCount: citationStyles.length
    });
  });

  api.get('/styles/search', (req, res) => {
    /* Search for a specific style.
     * Search should have a q=<search-query> parameter.
     */
    let search = req.query.q;
    let options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 3,
      keys: ["citationName", "citationShortName"]
    }

    console.log("Query:", search);
    let fuse = new Fuse(citationStyles, options);
    res.json(fuse.search(search));
  });

  api.get('/fields/:type', (req, res) => {
    /* Fetch a list of citation fields
     * for the specified type.
     */

    let type = req.params.type.toLowerCase();
    let labels = xpath.select(`//typeMap[@zType='${type}']/*/@label`, typeMap);
    let values = xpath.select(`//typeMap[@zType='${type}']/*/@value`, typeMap);

    console.log(labels);
    let fields = Object.assign({}, ...labels.map((n, index) => ({[n.value]: values[index].value})))
    console.log(fields);

    res.send(fields);
  });

  api.get('/cite', (req, res) => {
    let style = req.query.style;
    console.log(style, req.query);
    res.json(makebib.makeBib(style, req.query));
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
        res.json(results);
      });
	});

	return api;
}

function getCitationStyleList() {
  // Get citation style names - returned as metadata from root
  shell.cd("csl");
  let citationStyles = [];
  let citationData = shell.ls("*.csl", "dependent/*.csl");

  // TODO: Keep track of which styles are actually popular instead of hardcoding a list
  // NOTE: These must exactly match the names specified in the .csl files.
  let popularStyles = [
    "Chicago Manual of Style 17th edition (full note)",
    "Chicago Manual of Style 16th edition (full note)",
    "Chicago Manual of Style 17th edition (author-date)",
    "American Psychological Association 7th edition",
    "American Psychological Association 6th edition",
    "Modern Language Association 7th edition",
    "Modern Language Association 8th edition"
  ];

  let index = 0;
  for (let style of citationData) {
    style = shell.cat(style);

    let citationName = style.match(/(?<=<title>)[^<]+/g)[0];
    let citationShortName = style.match(/(?<=<title-short>)[^<]+/g);
    if (citationShortName != null) citationShortName = citationShortName[0];

    let popular = false;
    for (let popularStyle of popularStyles) {
      if (citationName == popularStyle) popular = true;
    }

    if (popular) {
      citationStyles.unshift({
        citationName,
        citationShortName,
        citationFile: citationData[index],
      });
    } else {
      citationStyles.push({
        citationName,
        citationShortName,
        citationFile: citationData[index],
      });
    }

    ++index;
  }
  shell.cd("..");

  return citationStyles;
}

function getTypeMap() {
  /* Get TypeMap and parse it into an XMLDOM.
   * Note: It's OK to use readFileSync here because
   * this function is only run on server startup.
   *
   * In fact, we want this to block as the /<type>/fields
   * endpoint requires it.
   */

  let parser = new DOMParser();
  let typeMapText = fs.readFileSync("data/typeMap.xml").toString();
  let typeMap = parser.parseFromString(typeMapText, "text/xml");

  return typeMap;
}
