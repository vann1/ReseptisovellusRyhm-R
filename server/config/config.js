require('dotenv').config();
/*database config(create own .env file to client/src and copy paste this: 

ACCESS_TOKEN_SECRET=614cf36c10aad6d1ebf3757f672de4325e8d2162a6852d31c297761dc327dc0dad820679a901c4074a48adb3c2cb4808a354a30ce77f7be3491a4b6d0d596c5a
REFRESH_TOKEN_SECRET=5b8819ea1ef239e7588ff8f85b4f79644f3ed24e8a80abe2f5f328c74df6fea06ec7435da7257c3d5c9de767c956ea63906cecb333d2900491824673dc56e8d7
DB_USER=reseptiadmin
DB_PASSWORD=P2ssw0rd
DB_SERVER=reseptidb.database.windows.net
DB_DATABASE=reseptidb

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