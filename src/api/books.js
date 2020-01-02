import bookify from 'bookify';
import superagent from 'superagent';
import superagentCache from 'superagent-cache';

const bookifyCache = new bookify({ superagent: superagentCache(superagent) });

function search(query) {
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
  return new Promise((done, error) => {
    console.log("Searching for book...")
    bookifyCache.search(query)
      .then((results) => {
        let books = [];
        for (let result of results) {
          books.push({
            title: result.title,
            authors: result.authors == undefined ? "Unknown Author": result.authors,
            publisher: result.publisher == undefined ? "Unknown Publisher" : result.publisher,
            date: result.publishedDate == undefined ? "Published Date Unknown": result.publishedDate,
            categories: result.categories,
            thumbnail: result.thumbnail,
            pages: result.pageCount == undefined ? "Unknown page count" : result.pageCount
          });
        }
        done(books);
      })
      .catch((err) => {
        console.log(err);
        error(err);
      });
  });
}

module.exports.search = search;
