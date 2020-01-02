import fs from 'fs';
import citeprocnode from '../lib/citeprocnode';

// One time setup
let sys = new citeprocnode.simpleSys();
let enUS = fs.readFileSync('./csl-locales/locales-en-US.xml', 'utf-8');
sys.addLocale('en-US', enUS);

function makeBib() {
  let styleString = fs.readFileSync('./csl/apa.csl');
  let engine = sys.newEngine(styleString, 'en-US', null);
  let items = {
    "0": {
      "id": "0",
      "accessed": {
        "month": 9,
        "year": 2019,
        "day": 10
      },
      "author": [{
        "given": "your",
        "family": "mom"
      }],
      "title": "Your Mom Gay",
      "type": "book",
      "versionNumber": 69420
    }
  };
  sys.items = items;

  engine.updateItems(Object.keys(items));
  let bib = engine.makeBibliography();
  console.log(bib);
  return bib;
}

function dateToCSL(date) {
  if (date.split())
  return {
  };
}

module.exports.makeBib = makeBib;
