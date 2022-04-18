const db = require('../index');

async function findPlayers(userId) {
  return db.query(`
    SELECT *
    FROM $1:name
    WHERE $2:name = $3`, ['Players', 'userId', userId])
  .then((results) => {
    if (results && results.length > 0) return Promise.resolve(results);
    else return Promise.resolve(null);
  })
  .catch((err) => Promise.reject(err));
}

async function createPlayer(turnIndex, userId, gameId) {
  return db.any(`
  INSERT INTO $1:name($2:name, $3:name, $4:name)
  VALUES($5, $6, $7)
  RETURNING *`, ['Players', 'turnIndex', 'userId', 'gameId', turnIndex, userId, gameId])
  .then((result) => {
    if (result) {
      return Promise.resolve(result[0]);
    } else return Promise.resolve(null);
  })
}

module.exports = {
  findPlayers,
  createPlayer
}