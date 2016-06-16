exports.seed = function(knex, Promise) {
  var will, lucas, lucy;
  return knex('comment').del()
  .then(function() {return knex('post').del()})
  .then(function() {return knex('user').del()})
  .then(users)
  .then(posts)
  .then(postIds)
  .then(seedComment);

  function users() {
    return Promise.join(
      knex('user').insert({
          username: 'willthomas',
          first_name: 'Will',
          last_name: 'Thomas'
      }).returning('id'),
      knex('user').insert({
          username: 'lucasbarbula',
          first_name: 'Lucas',
          last_name: 'Barbula'
      }).returning('id'),
      knex('user').insert({
          username: 'lucygoosy',
          first_name: 'Lucy',
          last_name: 'Follansbee'
      }).returning('id')
    );
  }

  function posts(ids) {
    will = ids[0][0];
    lucas = ids[1][0];
    lucy = ids[2][0];
    return Promise.join(
      knex('post').insert({
        title: 'Beavers',
        body: 'I love beavers. Sometimes I go beaver watching on the Platte River.',
        author_id: will
      }).returning('id'),
      knex('post').insert({
        title: '',
        body: '',
        author_id: lucas
      }).returning('id'),
      knex('post').insert({
        title: 'Almost birthday time!',
        body: 'Birthday party this weekend, let\'s all get trollied!',
        author_id: lucy
      }).returning('id')
    );
  }

  function postIds(postIds) {
    return {
      posts: {
        zero: postIds[0][0],
        one: postIds[1][0],
        two: postIds[2][0]
      },
      users: {
        will: will,
        lucas: lucas,
        lucy: lucy
      }
    };
  }

  function seedComment(data) {
    return Promise.join(
      knex('comment').insert({
        body: 'Cool story, bro.',
        author_id: data.users.lucy,
        post_id: data.posts.zero
      }),
      knex('comment').insert({
        body: 'That is most unparliamentary lanuage!',
        author_id: data.users.will,
        post_id: data.posts.one
      }),
      knex('comment').insert({
        body: 'Quite. Quite, indeed.',
        author_id: data.users.lucas,
        post_id: data.posts.two
      })
    );
  }

};
