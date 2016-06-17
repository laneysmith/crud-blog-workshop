var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var pg = require('pg');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   knex('host')
//   .select(["host.name as Host", "parasite.name as Parasite"])
//   .join('host_parasite', function() {
//     this.on("host.id", "=", "host_parasite.host_id")
//   })
//   .join('parasite', function() {
//     this.on("parasite.id", "=", "host_parasite.parasite_id")
//   })
//   .then(function(rows){
//     res.render('index', { title: 'Express', rows: rows });
//   })
//   .catch(function(error){
//     console.log(error);
//     next(error)
//   })
// });

// get blog posts
router.get('/', function(req, res) {
    knex('post')
    .select('post.body', 'post.title', 'user.username')
    .join('user', function() {
      this.on("author_id", "=", "user.id")
    })
    .join('comment', function() {
      this.on("post_id", "=", "post.id")
    })
    .then(function(posts){
      console.log(posts);
      res.render('index', {posts: posts});
    })
    .catch(function(error){
      console.log(error);
      next(error)
    })
});


module.exports = router;
