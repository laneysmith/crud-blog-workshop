var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var pg = require('pg');

// Populate all blog posts on index page
router.get('/', function(req, res, next) {
  knex('post')
    .select(
      'post.id',
      'post.created_at',
      'post.title',
      'user.username',
      'post.body'
    )
    .join('user', function() {
      this.on("post.author_id", "=", "user.id")
    })
    .then(function(data){
      res.render('index', {posts: data, title: 'THIS BLOG'});
    })
    .catch(function(error){
      console.log(error);
      next(error)
    })
});

// Populate blog post & comments on permalink page
router.get('/:id', function(req, res, next){
  return Promise.all([
    knex('post')
      .select(
        'post.id as postId',
        'post.title as title',
        'post.created_at as date',
        'post.body as postBody',
        'user.username as username'
      )
      .join('user', function() {
        this.on("post.author_id", "=", "user.id")
      })
      .where("post.id", req.params.id)
      .first(),
    knex('comment')
      .select(
        'comment.author_id as authorId',
        'user.id as userId',
        'comment.id as commentId',
        'user.username',
        'comment.body'
      )
      .join('user', function() {
        this.on("comment.author_id", "=", "user.id")
      })
      .where("comment.post_id", req.params.id),
    knex('user')
      .select(
        'user.username',
        'user.id'
      )
  ])
  .then(function(data){
    res.render('permalink', {postDetail: data[0], postComments: data[1], usernames: data[2]})
  })
  .catch(function(error){
    console.log(error);
    next(error)
  })
})

// Add comment to permalink page
router.post('/:id/', function(req, res, next) {
  knex('comment').insert(req.body).then(function(){
    res.redirect('/' + req.params.id);
  }).catch(function(error) {
    console.log(error);
    next(error)
  })
});

// Delete comment from permalink page
router.get('/:postId/:commentId/deleteComment', function(req, res, next) {
  knex('comment').where({id: req.params.commentId}).del().then(function(data) {
    res.redirect('/' + req.params.postId);
  })
});

// Populate post data on edit page
router.get('/:id/edit', function(req, res, next) {
  knex('post').where({id: req.params.id}).first().then(function(data) {
    res.render('edit', {post: data})
  })
});

// Edit/update blog post functionality
router.post('/:id/edit', function(req, res, next) {
  knex('post').where({id: req.params.id}).update(req.body).then(function () {
    res.redirect('/' + req.params.id);
  })
});

// Delete blog post
router.get('/:id/delete', function(req, res, next) {
  knex('comment').where({post_id: req.params.id}).del().then(
    function(){
      knex('post').where({id: req.params.id}).del().then(function(data) {
        res.redirect('/');
      })
    }
  )

});

module.exports = router;
