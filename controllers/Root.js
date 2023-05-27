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
const RootLink = (req, res, next) => {
    const title = req.body.title;
    const status = req.body.status;
    if(req.body.title !== '') {
    const client =  pool.connect((error, client, done) => {
        
            if(error) { return res.status(500).json({ message: 'Internal Server Error' }); }
            // Insert the data into the "todolist" table
            client.query('INSERT INTO todolist (title, status) VALUES ($1, $2)', [title, status], (error, result) => {
                  // Release the client back to the pool
                  done();
                  // in case of error
                  if(error) { return  res.status(500).json({ message: 'Internal Server Error' }); }
                  //in case of success
                  return res.status(200).json({ message: 'Success' });
              })
        });
    }
};

module.exports = { RootLink : RootLink };