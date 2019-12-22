import bookify from 'bookify';

const bookifyCache = new bookify();

function search(query) {
  return new Promise((done, error) => {
    bookifyCache.search(query)
    .then((result) => {
      done(result);
    });
  });
}

module.exports.search = search;
