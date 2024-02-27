require('dotenv').config();
/*database config(create own .env file to client/src and copy paste this: 


)
.env is set in .gitignore. This is becuase database credentials should not be commited to github for safety reasons.
*/
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
      encrypt: true,
    },
  };

  module.exports = config;