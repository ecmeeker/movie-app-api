var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    //DB error;
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database!');
    db.run(`CREATE TABLE movie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text,
      genre text,
      popularity text,
      platform text,
      description text UNIQUE,
      watched boolean,
      dateWatched Date,
      CONSTRAINT description_unique UNIQUE (description)
    )`,
    (err) => {
      if (err){

      } else {
        //Table created
        console.log('Movie table created!');
      }
    });
  }
});

module.exports = db;
