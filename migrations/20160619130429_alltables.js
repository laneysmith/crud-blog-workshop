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
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('author_id').references('user.id');
      table.string('title');
      table.text('body');
    });
  }).then(function(){
    return knex.schema.createTable('comment', function(table) {
      table.increments();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('author_id').references('id').inTable('user');
      table.integer('post_id').references('post.id');
      table.text('body');
    });
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comment')
  .then(function(){
    return knex.schema.dropTableIfExists('post');
  }).then(function(){
    return knex.schema.dropTableIfExists('user');
  })
};
