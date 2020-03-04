import fs from 'fs';
import citeprocnode from '../lib/citeprocnode';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

// One time setup
let sys = new citeprocnode.simpleSys();
loadLocales(sys, './csl-locales');

let parser = new DOMParser();

function loadLocales(sys, localeDir) {
  let locales = fs.readFileSync(localeDir + '/locales.json', 'utf-8');
  for (let locale of Object.keys(JSON.parse(locales)['language-names'])) {
    let localeString = fs.readFileSync(localeDir + '/locales-' + locale + '.xml', 'utf-8');
    sys.addLocale(locale, localeString);
  }
}

function makeBib(style, item) {
  /* Generate a bibliography.
   * @param style: CSL citation style file.
   * @param item: an item in CSL-JSON format
   * (see https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#introduction)
   */
  let styleString = loadStyle("./csl", style);
  let engine = sys.newEngine(styleString, 'en-US', null);
  let items = {
    "0": formatItem(item)
  };
  sys.items = items;
  console.log(items);

  engine.updateItems(Object.keys(items));
  let bib = engine.makeBibliography();
  console.log("bib", bib);
  // Bibliography is formatted as array [<css info>, <html element>]
  // We only want the HTML element
  return bib[1];
}

function loadStyle(cslDirectory, style) {
  /* Returns the specified CSL style in a string.
   * Handles dependent styles.
   * @param cslDirectory: directory w/CSL styles
   * @param style: style to load
   * @return <Buffer> CSL file
   */
  let styleString = fs.readFileSync(cslDirectory + "/" + style);
  if (style.startsWith("dependent")) {
    let tree = parser.parseFromString(styleString.toString());
    let select = xpath.useNamespaces({"csl": "http://purl.org/net/xbiblio/csl"});
    let parent = select("//csl:link[@rel='independent-parent']/@href", tree)[0].value;
    parent = cslDirectory + "/" + parent.substr(parent.lastIndexOf('/') + 1) + ".csl";
    console.log(parent);
    return fs.readFileSync(parent);
  } else {
    return styleString;
  }
}

function formatItem(item) {
  /* Format a request to CSL-JSON format.
   * Since CSL-JSON mostly already matches the
   * format you'd expect, we're going to take
   * the lazy route and tack on the necessary attributes.
   */
  item.id = "0";
  item.accessed = {
    raw: item.accessDate || new Date().toISOString().slice(0,10)
  };
  item.issued = {
    raw: item.date
  }

  let authors = item.authors;
  console.log("authors", item.authors);
  item.author = [];

  if (authors == undefined) authors = [];

  for (let author of authors) {
    if (author.type == "Person") {
      item.author.push({
        given: author.first,
        family: author.last
      });
    } else {
      item.author.push({
        literal: author.full
      });
    }
  }

  if (item.publisher == "Unknown Publisher" || item.publisher == "") {
    delete item.publisher;
  }

  return item;
}

function randomUID() {
  let uid = "";
  let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 15; i++) {
    uid += chars[Math.floor(Math.random()*chars.length)];
  }
  return uid;
}

module.exports.makeBib = makeBib;
module.exports.formatItem = formatItem;
