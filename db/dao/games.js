const db = require('../index');

async function findGame(gameId) {
  return db.query(`
    SELECT *
    FROM $1:name
    WHERE id = $2`, ['Games', gameId])
  .then((results) => {
    if (results && results.length === 1) return Promise.resolve(results);
    else return Promise.resolve(null);
  })
  .catch((err) => Promise.reject(err));
}

module.exports = {
  findGame
}