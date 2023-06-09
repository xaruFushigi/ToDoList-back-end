//---------importing dependecies-----------------------//
const {
  express,
  expressSession,
  app,
  cors,
  cookieParser,
  sessionStore,
} = require("./dependencies");
//---------END OF importing dependecies------------------//

//---------ROUTES---------------------------------------//
const RootLink = require("./controllers/Root");
const DeleteLink = require("./controllers/Delete");
const UpdateLink = require("./controllers/UpdateLink");
const ReadDatabaseLink = require("./controllers/ReadDatabase");
//---------END OF ROUTES--------------------------------//

//---------Middlewear------------------//
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieParser(process.env.SESSION_SECRET, {
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  })
);
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    allowedHeaders: ["Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: "session_cookie",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production" ? true : "auto",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      resave: false,
      saveUninitialized: false,
    },
  })
);
app.set("trust proxy", true);
//---------END OF Middlewear------------------//

//----------Routes----------------------------//
app.post("/", (req, res, next) => {
  RootLink.RootLink(req, res, next);
});
app.get("/database", (req, res, next) => {
  ReadDatabaseLink.ReadDatabase(req, res);
});
app.put("/updateStatus/:id", (req, res) => {
  UpdateLink.UpdateLink(req, res);
});
app.delete("/delete", (req, res) => {
  const { id } = req.body;
  DeleteLink(res, id);
});
//----------END OF Routes---------------------//
//Start of server
// app.listen(process.env.PORT, () => {
//   console.log(`app is running in port ${process.env.PORT}`);
// });
