//---------importing dependecies-----------------------//
const { session } = require('passport');
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
        csrfProtection } = require('./dependencies');
//---------END OF importing dependecies------------------//

//---------ROUTES---------------------------------------//
const RootLink = require('./controllers/Root');
const { DeleteLink } = require('./controllers/Delete');
//---------END OF ROUTES--------------------------------//

//---------Middlewear------------------//
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET,
                     {sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'}));
app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'DELETE'],
}));
app.use(expressSession({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
    name : 'session_cookie',
    cookie : {
        maxAge : 24 * 60 * 60 * 1000,
        secure : process.env.NODE_ENV === 'production'? 'true' : 'auto',
        sameSite : process.env.NODE_ENV === 'production'? 'none' : 'lax',
        httpOnly : true,
        resave : false,
        saveUninitialized : false
    }
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // This will allow requests from all domains. You can set it to a specific domain as well.
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
//---------END OF Middlewear------------------//

const fetchDataHandler = (req, res) => {
    const { status } = req.query;      //status of main window option value
    const { checkbox, id } = req.body;     //checkbox value in the list
    
    let query = 'SELECT * FROM todolist';
    //If a status is 'Incomplete' or 'Complete' and if it is not 'All' 
    if(status && status !== 'All') { 
        query += ` WHERE status = '${status}'` 
        if(checkbox) {
            query = 'UPDATE todolist SET status = $1 WHERE id = $2';
            if(status === 'Complete') {
                const values = ['Incomplete', id];
                const client = pool.connect();
                const result = client.query(query, values);
                client.release();
            }
            console.log('Row updated');
        }
        else if (!checkbox) {
            query = 'UPDATE todolist SET status = $1 WHERE id = $2';
            if(status === 'Incomplete'){
                const values = ['Complete', id];
                const client = pool.connect();
                const result = client.query(query, values);
                client.release();
            }
        }
        else{ console.log('did not update') }
        }
    
    //If status is 'All'
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error executing query', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      
      return res.status(200).json(result.rows);
    });
};

//----------Routes----------------------------//
app.post('/', (req, res, next) => {RootLink.RootLink(req, res, next)});
app.post('/database', fetchDataHandler);
app.delete('/delete', (req, res) => {
    const {id} =req.body;
    DeleteLink(res, id) });
//----------END OF Routes---------------------//

//Start of server
app.listen(`${process.env.PORT}`, ()=>{console.log(`app is running in port ${process.env.PORT}`)});