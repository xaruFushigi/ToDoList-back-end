//---------importing dependecies-----------------------//
const { pool } = require("../dependencies");
//---------END OF importing dependecies------------------//

const DeleteLink = (res, id) => {
  pool.query("DELETE FROM todolist WHERE id = $1", [id], (error, result) => {
    if (error)
      return res.status(500).json({ message: "Error occurred while deleting" });
    else {
      return res.status(200).json({ message: "has been deleted" });
    }
  });
};

module.exports = DeleteLink;
