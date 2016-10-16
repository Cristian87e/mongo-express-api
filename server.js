var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var fs = require('fs');
/// Mongoose
require('collections/Cat/Cat');
/// /Mongose

var app = express();
var port = 8082;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/planets', function(req, res) {
  fs.readFile('planets.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.post('/api/planets', function(req, res) {
  var id = req.param('id');
  var name = req.param('name');

  fs.readFile('planets.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var resData = JSON.parse(data);

    resData.items.push({
      id: (resData.items.length + 1),
      name: name
    });

    fs.writeFile('planets.json', JSON.stringify(resData), function(err) {
      if(err) {
        console.log(err);
      } else {
        res.status(200).jsonp(resData);
      }
    });
  });
});

app.put('/api/planets', upload.array(), function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
  console.log(JSON.stringify(req.body));
  console.log(`id: ${id}`);
  console.log(`name: ${name}`);
  fs.readFile('planets.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var resData = JSON.parse(data);

    resData.items = resData.items.map(function (item) {
        return (item.id == id) ? {
          id: id,
          name: name
        } :
        item;
    });

    fs.writeFile('planets.json', JSON.stringify(resData), function(err) {
      if(err) {
        console.log(err);
      } else {
        res.status(200).jsonp(resData);
      }
    });
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
