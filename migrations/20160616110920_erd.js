
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table) {
    table.increments();
    table.string('username');
    table.string('first_name');
    table.string('last_name');
    table.string('email');
  }).then(function(){
    return knex.schema.createTable('post', function(table) {
      table.increments();
      table.timestamp('created_at')
      table.integer('author_id').references('user.id');
      table.string('title');
      table.text('body');
    });
  }).then(function(){
    return knex.schema.createTable('comment', function(table) {
      table.increments();
      table.timestamp('created_at')
      table.integer('author_id').references('id').inTable('user');
      table.integer('post_id').references('post.id');
      table.text('body');
    });
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comment')
  .then(function(){
    return knex.schema.dropTable('post');
  }).then(function(){
    return knex.schema.dropTable('user');
  })
};
