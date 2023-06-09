//---------importing dependecies-----------------------//
const { pool } = require("../dependencies");
//---------END OF importing dependecies------------------//
const RootLink = (req, res, next) => {
  const { title, status } = req.body;

  if (req.body.title !== "") {
    const client = pool.connect((error, client, done) => {
      if (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      // Insert the data into the "todolist" table
      client.query(
        "INSERT INTO todolist (title, status, dateoftask) VALUES ($1, $2, $3)",
        [title, status, new Date()],
        (error, result) => {
          // Release the client back to the pool
          done();
          // in case of error
          if (error) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          //in case of success
          return res.status(200).json({ message: "Success" });
        }
      );
    });
  }
};

module.exports = { RootLink: RootLink };
