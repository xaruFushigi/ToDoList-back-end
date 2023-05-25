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
        sessionStore,
        pgSession,
        csrfProtection } = require('./dependencies');
//---------END OF importing dependecies------------------//

const RootLink = (req, res, next) => {
    res.status(200).json({ message: 'Success' });
    const title = req.body.title;
    const status = req.body.status;


};

module.exports = { RootLink : RootLink };