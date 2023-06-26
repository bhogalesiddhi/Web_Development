//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model("Article",articleSchema);
//TODO

/////////////////////////////////Request Targeting All Articles//////////////////////

app.route("/articles").get(function(req,res){
  Article.find({})
  .then((foundArticles) => {
    console.log(foundArticles);
  })
})
.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
      content: req.body.content
  });
  newArticle.save()
  .then(()  => {
      res.send("Succefully added a new article.");
  })
})
.delete(function(req,res){
  Article.deleteMany({})
  .then(()  => {
      res.send("Succefully deleted.");
  })
});


////////////////////////////////////////Request Targeting A Specific Article////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle})
  .then((foundArticle) =>{
    if(foundArticle){
    res.send(foundArticle);
    }
    else{
      res.send("No articles matching that title was found");;
    }
  })
})
.put(function(req,res){
  Article.updateMany(
    {title:req.params.articleTitle},
    {title:req.body.title, content: req.body.content}
    )
    .then(()  => {
      res.send("Succefully update the content of the selected article.");
  })
})
.patch(function(req,res){
  Article.updateMany(
    {title: req.params.articleTitle},
    {$set : req.body})
    .then(()  => {
      res.send("Succefully updated the article.");
  })
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle})
    .then(()  => {
      res.send("Succefully deleted the selected article.");
  })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});