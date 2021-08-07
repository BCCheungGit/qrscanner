/*
    Databases.js- 

*/

const Pool = require('pg').Pool;



const pool = new Pool({
    user: 'postgres',
    host: 'www.cloudority.com',
    database: 'ocm_db',
    password: 'passwordrm',
    port: '5432'
  });



module.exports = pool;