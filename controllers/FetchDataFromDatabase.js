//---------importing dependecies-----------------------//
const { session } = require('passport');
const { express, 
        expressSession,
        app,
        dotenv,
        db,
        cors,
        cookieParser,
        cookieSession,
        csrf,
        pool,
        sessionStore,
        pgSession,
        csrfProtection } = require('../dependencies');
//---------END OF importing dependecies------------------//

const FetchDataFromDatabase = (callback) => {
    pool.query('SELECT * FROM todolist', (error, result) => {
      if (error) {
        console.error('Error executing query', error);
        callback(error, null);
      } else {
        callback(null, result.rows);
      }
    });
    return res.status(200).json(data);
  };
  
  module.exports =  FetchDataFromDatabase ;