// SERVER-SIDE JAVASCRIPT
//require models
var db = require('./models');
//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
//require bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums){
  res.json(albums);
});
});

app.post('/api/albums', function album_post(req, res){
  db.Album.create({artistName: req.body.artistName, name: req.body.name, releaseDate: req.body.releaseDate, genres: [req.body.genres]}, function(error, album){
      console.log(req.body);
      res.json(album);
  });
});

app.post('/api/albums/:album_id/songs', function song_post(req, res){
  // console.log(req.params.album_id);
  db.Album.findById(req.params.album_id, function (err, findAlbum){
    db.Album.findById(req.params.album_id)
      .exec(function (err, findAlbum){
        if (err) {
          console.log(err);
        }else {
          findAlbum.songs.push(req.body);
          findAlbum.save(console.log('success'));
        }
        res.json(findAlbum);
      });
  });
});

app.get('/api/albums/:id', function (req,res){
  db.Album.findOne({_id: req.params.id}, function(err, data){
    res.json(albums);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
