require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/crud_blog_workshop'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
