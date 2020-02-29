import axios from 'axios';

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

function getInfo(url) {
  /* Return a list of query results for a Website:
   * {
   *   type: "website",
   *   url: string,
   *   title: string,
   *   author: [string, string, etc],
   *   publisher: string,
   *   date: string (ISO date),
   *   <anything else metascraper picks up>
   * }
   */
  return new Promise((done, error) => {
    axios.get(url)
      .then((res) => {
        metascraper({html: res.data, url: url})
          .then((metadata) => {
            done(metadata);
          })
          .catch((err) => {
            error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

module.exports.getInfo = getInfo;
