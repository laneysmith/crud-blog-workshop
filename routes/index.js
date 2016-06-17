var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var pg = require('pg');

// Populate all blog posts on index page
router.get('/', function(req, res, next) {
    knex('post')
    .select(
      // 'post',
      'post.id',
      'post.created_at',
      'post.title',
      'user.username',
      'post.body',
      'comment'
      // knex.raw('COUNT(comment)')
    )
    // .groupBy('post.id')
    .join('user', function() {
      this.on("author_id", "=", "user.id")
    })
    .join('comment', function() {
      this.on("post_id", "=", "post.id")
    })
    .then(function(posts){
      // console.log(posts);
      res.render('index', {posts: posts});
    })
    .catch(function(error){
      console.log(error);
      next(error)
    })
});

// Populate blog post & comments on permalink page
router.get('/:id', function(req, res, next){
  console.log('req.params.id = ' + req.params.id);
  return Promise.all([
    knex('post')
      .join('user', function() {
        this.on("post.author_id", "=", "user.id")
      })
      .where("post.id", req.params.id)
      .first(),
    knex('comment')
      .join('user', function() {
        this.on("comment.author_id", "=", "user.id")
      })
      .where("comment.post_id", req.params.id)
  ])
  .then(function(data){
    res.render('permalink', {postDetail: data[0], postComments: data[1]})
  })
  .catch(function(error){
    console.log(error);
    next(error)
  })
})

// Add comment to permalink page
router.post('/:id/', function(req, res, next) {
  knex('comment').insert(req.body).then(function(){
    res.redirect('/');
  }).catch(function(error) {
    console.log(error);
    next(error)
  })
});

// Edit blog post
router.get('/:id/edit', function(req, res, next) {
  knex('post').where({id: req.params.id}).first().then(function(data) {
    res.render('edit', {post: data})
  })
});
router.post('/:id/edit', function(req, res, next) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect('/' + req.params.id);
  })
});

// Delete blog post
router.get('/:id/delete', function(req, res, next) {
  knex('post').where({id: req.params.id}).del().then(function(data) {
    res.redirect('/');
  })
});

// Post detail page
// router.get('/:id', function(req, res, next) {
//   knex('post')
//     .where({id: req.params.id})
//     .first()
//     .join('comment', function() {
//       this.on("post_id", "=", "post.id")
//     })
//     .then(function(data) {
//     console.log(data);
//     res.render('post', {post: data});
//   })
// });

module.exports = router;
