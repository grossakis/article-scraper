var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var logger = require("morgan");
var path = require("path");
var db = require("./models");

var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/VGarticles");

// app.get("/scrape", function(req, res){
//     axios.get("https://www.gamespot.com/news/").then(function(response) {
//         var $ = cheerio.load(response.data);

//         $("article.media").each(function(i, element) {
//             var result = {};

//             result.title = $(this)
//                 .children().find("h3")
//                 .text();
//             result.link = "https://www.gamespot.com" + $(this)
//                 .children("a")
//                 .attr("href")
//             result.image = $(this)
//                 .children().find("img")
//                 .attr("src")
//             result.description = $(this)
//                 .children().find("p")
//                 .text()
//             // console.log(result)
//             db.Article.create(result)
//                 .then(function(dbArticle) {
//                     console.log(dbArticle)
//                 })
//                 .catch(function(err) {
//                     return res.json(err);
//                 });
//         });
//         res.send("SCRAPING COMPLETE");
//     });
// });

app.get("/scrape", function(req, res){
    axios.get("https://www.gamespot.com/news/").then(function(response) {
        var allResults = []
        var $ = cheerio.load(response.data);
        $("article.media").each(function(i, element) {
            var result = {};
            result.title = $(this)
                .children().find("h3")
                .text();
            result.link = "https://www.gamespot.com" + $(this)
                .children("a")
                .attr("href")
            result.image = $(this)
                .children().find("img")
                .attr("src")
            result.description = $(this)
                .children().find("p")
                .text()
            allResults.push(result)
        });
        // res.send("SCRAPING COMPLETE");
        res.json(allResults);
    });
});

app.post("/articles", function (req, res) {
    // db.Article.create()
    db.Article.create(req.body)
        .then(function(dbArticle) {
            console.log(dbArticle)
        })
        .catch(function(err) {
            return res.json(err);
        });
})

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
})

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
        .populate('note')
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        })
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            // console.log(dbNote)
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true})
        })
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})

app.delete("/articles/:id", function(req, res) {
    db.Article.deleteOne({_id:req.params.id})
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})

app.delete("/article-note/:id", function(req, res) {
    db.Article.update({_id:req.params.id}, {$unset:{note:''}})
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})

app.get("/saved-articles", function(req, res) {
    res.sendFile(path.join(__dirname, "public/saved-articles.html"));
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});