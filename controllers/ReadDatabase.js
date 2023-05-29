//---------importing dependecies-----------------------//
const { session } = require("passport");
const {
  express,
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
  csrfProtection,
} = require("../dependencies");
//---------END OF importing dependecies------------------//

const ReadDatabase = (req, res) => {
  const { status } = req.query; // status of the main window option value

  let query = "SELECT * FROM todolist";
  let values = [];

  // If status is provided and not equal to 'All'
  if (status && status !== "All") {
    query = "SELECT * FROM todolist WHERE status = $1";
    values = [status];
  }

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(result.rows);
  });
};

module.exports = { ReadDatabase };
