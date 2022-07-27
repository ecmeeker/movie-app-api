// Create app
var express = require("express");
var app = express();
var db = require("./database.js");
var cors = require("cors")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Server port
var HTTP_PORT = 8000;
// Start Server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %HTTP_PORT%'.replace('%HTTP_PORT%',HTTP_PORT));
});

// Root endpoint
app.get('/', (req, res, next) => {
  res.json({'message':'Ok'});
});

// CRUD API Enpoints
// GET /movies
app.get("/movies", (req, res, next) => {
  var sql = "select * from movie";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err){
      res.status(400).json({"error":err.message});
      return;
    }
    res.json(rows);
  });
});

// GET /movie/:id
app.get("/movie/:id", (req, res, next) => {
  var sql = "select * from movie where id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json(row);
  });
});

// POST /movie/
app.post("/movie/", (req, res, next) => {
  var errors = [];
  var data = {
    name: req.body.name,
    genre: req.body.genre,
    popularity: req.body.popularity,
    platform: req.body.platform,
    description: req.body.description,
    watched: req.body.watched,
    dateWatched: req.body.dateWatched
  }
  db.run(`INSERT INTO movie (name, genre, platform, popularity, description, watched, dateWatched) VALUES (?,?,?,?,?,?,?)`,[data.name, data.genre, data.platform, data.popularity, data.description, "false", data.dateWatched],
  (err, result) => {
    if (err){
      res.status(400).json({"error": res.message});
      return;
    }
    res.json(data);
  });
});

// GET /lastinsert
app.get("/movie/lastinsert", (req, res, next) => {
  var sql = "select last_insert_rowid()";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err){
      res.status(400).json({"error":err.message});
      return;
    }
    res.json(rows);
  });
});

// PATCH /movie/:id
app.patch("/movie/:id", (req, res, next) => {
  var data = {
    name: req.body.name,
    genre: req.body.genre,
    platform: req.body.platform,
    description: req.body.description,
    watched: req.body.watched,
    dateWatched: req.body.dateWatched
  }
  db.run(
    `UPDATE movie set
      name = COALESCE(?,name),
      genre = COALESCE(?,genre),
      platform = COALESCE(?,platform),
      description = COALESCE(?,description),
      watched = COALESCE(?,watched),
      dateWatched = COALESCE(?,dateWatched)
      WHERE id = ?`,
    [data.name, data.genre, data.platform, data.description, data.watched, data.dateWatched, req.params.id],
    (err, result) => {
      if (err){
        res.status(400).json({"error": res.message});
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes
      });
    });
});

// DELETE /movie/:id
app.delete("/movie/:id", (req, res, next) => {
  db.run(
    `DELETE FROM movie WHERE id = ?`,
    req.params.id,
    (err, result) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
    });
    res.json({
      message:"deleted",
      changes: this.changes
    });
  });

// Default response
app.use((req, res) => {
  res.status(404);
});
