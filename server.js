var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");


var port = process.env.PORT || 3000;

var app = express();

var MONGODB_URI = "mongodb://heroku_1f70ljt0:44kepupk4aov6d4t0h8n6m7d3u@ds129066.mlab.com:29066/heroku_1f70ljt0";
var databaseUri = "mongodb://localhost/broncosHw";

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;

if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri,{useMongoClient: true});
}  

app.get("/scrape", function(req, res) {
  
  axios.get("http://www.9news.com/sports/denver-broncos").then(function(response) {
    var $ = cheerio.load(response.data);

    $("li.hgpm-item").each(function(i, element) {
      var result = {};

      result.title = $(this).children('a.hgpm-link').find('span.hgpm-list-hed').text();
      result.content = $(this).find('span.hgpm-back-listview-text').text().trim();
      result.time = $(this).children('a.hgpm-link').find('ul.hgpm-meta').children('li.hgpm-time').children('span').text();
      var link = $(this).children('a.hgpm-link').attr('href');
      result.articleLink = `http://www.9news.com${link}`;
      Article
        .create(result)
        .then(function(Article) {
          res.send("Scrape Complete please go back to previous page");
        })
        .catch(function(err) {
          res.json(err);
        });
    });
  });
});

app.get("/articles", function(req, res) {
  Article
    .find({})
    .then(function(Article) {
      res.json(Article);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  Article
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(Article) {
      res.json(Article);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  Note
    .create(req.body)
    .then(function(Note) {
      return Article.findOneAndUpdate({ _id: req.params.id }, { note: Note._id }, { new: true });
    })
    .then(function(Article) {
      res.json(Article);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(port, function() {
  console.log("App running on port " + port + "!");
});

