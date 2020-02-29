import axios from 'axios';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

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

const parser = new DOMParser();

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
            // Format date
            if (metadata.date != null) {
              metadata.date = metadata.date.slice(0, 10);
            }

            // Get logo
            metadata.thumbnail = metadata.logo;
            delete metadata.logo;

            // Parse authors a bit
            if (metadata.author != null) {
              let authors = metadata.author.split(/,|and/g);
              delete metadata.author;
              metadata.authors = [];
              for (let author of authors) {
                if (author.trim() == metadata.publisher.trim()) continue;
                metadata.authors.push(author.trim());
              }
            }

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
