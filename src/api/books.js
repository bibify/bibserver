import bookify from 'bookify';

const bookifyCache = new bookify();

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
    bookifyCache.search(query)
    .then((results) => {
      let books = [];
      console.log(get)
      for (let result of results) {
        books.push({
          title: result.title,
          authors: result.authors,
          publisher: result.publisher,
          date: result.publishedDate,
          categories: result.categories,
          thumbnail: result.thumbnail,
          pages: result.pageCount
        });
      }
      done(books);
    });
  });
}

module.exports.search = search;
