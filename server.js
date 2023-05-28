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
const  DeleteLink  = require('./controllers/Delete');
const UpdateLink = require('./controllers/UpdateLink');
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
    console.log(req)
    const { status } = req.query;      //status of main window option value
    const query = status && status !== 'All' 
                    ? 'SELECT * FROM todolist WHERE status = $1'
                    : 'SELECT * FROM todolist';
    const values = status && status !== 'All' ? [status] : [];
    //If a status is 'Incomplete' or 'Complete' and if it is not 'All' 
    if(status && status !== 'All') {  
        pool.query(query,values, (error, result) => {
            const failureMessage = res.status(500).json({ message: 'Internal Server Error' }); 
            const successMessage = res.status(200).json(result.rows);

            if (error) { 
                console.log(error)
                return failureMessage };
            return successMessage;
          });
    }     
};

//----------Routes----------------------------//
app.post('/', (req, res, next) => {RootLink.RootLink(req, res, next)});
app.get('/database', fetchDataHandler);
app.put('/updateStatus', (req, res)=> {UpdateLink.UpdateLink(req, res)});
app.delete('/delete', (req, res) => {
    const {id} =req.body;
    DeleteLink(res, id) });
//----------END OF Routes---------------------//

//Start of server
app.listen(`${process.env.PORT}`, ()=>{console.log(`app is running in port ${process.env.PORT}`)});