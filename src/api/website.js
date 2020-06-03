// Yes, I know this is in commonJS, we'll move to ES6 eventually
const superagent = require('superagent');
//require('superagent-cache')(superagent);

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo-favicon')(),
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
    superagent.get(url)
      .end((err, res) => {
        if (err) error(err);

        metascraper({html: res.text, url: url})
          .then((metadata) => {
            // Format date
            if (metadata.date != null) {
              metadata.date = metadata.date.slice(0, 10);
            }

            // Get logo
            metadata.thumbnail = metadata.logo;
            delete metadata.logo;

            // The "publisher" metascraper returns is actually usually the website title - hard to get publisher
            // If a publisher is unavailable, default to the title of the page
            metadata["container-title"] = metadata.publisher || metadata.title;

            // url needs to uppercase for CSL to be happy
            metadata.URL = metadata.url;

            // Parse authors a bit
            if (metadata.author != null) {
              let authors = metadata.author.split(/,|and/g);
              delete metadata.author;
              metadata.authors = [];
              for (let author of authors) {
                // If there's XML tags left in authors that metascraper missed,
                // remove them
                // Also do some other cleaning up
                author = author.trim().replace(/(<.[^(><.)]+>)/g, "");

                // If the author is a valid author, add it to the list
                if (author == metadata.publisher.trim()) continue;
                metadata.authors.push(author);
              }
            }

            done(metadata);
          })
          .catch((err) => {
            error(err);
          });
      });
  });
}

module.exports.getInfo = getInfo;
