const { express, 
    expressSession,
    app,
    dotenv,
    db,
    pool,
    cors,
    cookieParser,
    cookieSession,
    csrf,
    sessionStore,
    pgSession,
    csrfProtection } = require('../dependencies');

const UpdateLink = (req, res) => {
    const { id, status } = req.body;
    const query = 'UPDATE todolist SET status = $1 WHERE id = $2';
    const values = [status, id];
          DataView.query(query, values, (error, result)=> {
            if(error) { res.status(500).json({error: 'Failed to update task status'}) }
            else{ res.json({success: true}) };
          })
        console.log('Row updated');
};

module.exports = { UpdateLink: UpdateLink };