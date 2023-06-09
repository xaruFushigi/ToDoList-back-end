const { pool } = require("../dependencies");

const UpdateLink = async (req, res) => {
  const id = req.params.id; // Retrieve the task ID from URL parameter
  const { status } = req.body;
  const query = "UPDATE todolist SET status = $1 WHERE id = $2";
  const values = [status, id];

  try {
    await pool.query(query, values);
    console.log("Row updated");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
};

module.exports = { UpdateLink: UpdateLink };
