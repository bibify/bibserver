import fs from 'fs';
import citeprocnode from '../lib/citeprocnode';

// One time setup
let sys = new citeprocnode.simpleSys();
let enUS = fs.readFileSync('./csl-locales/locales-en-US.xml', 'utf-8');
sys.addLocale('en-US', enUS);

function makeBib(style, item) {
  /* Generate a bibliography.
   * @param style: CSL citation style file.
   * @param item: an item in CSL-JSON format
   * (see https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#introduction)
   */
  let styleString = fs.readFileSync(style);
  let engine = sys.newEngine(styleString, 'en-US', null);
  let items = {
    "0": item
  };
  sys.items = items;

  engine.updateItems(Object.keys(items));
  let bib = engine.makeBibliography();
  console.log(bib);
  return bib;
}

module.exports.makeBib = makeBib;
