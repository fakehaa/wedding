const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up SQLite database
let db = new sqlite3.Database("./rsvp.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the RSVP database.");
});

// Create the RSVP table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS rsvp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    greetings TEXT,
    attendance TEXT NOT NULL
)`);

// Handle form submission
app.post("/submit-rsvp", (req, res) => {
  const { name, greetings, attendance } = req.body;

  // Insert the form data into the database
  db.run(
    `INSERT INTO rsvp (name, greetings, attendance) VALUES (?, ?, ?)`,
    [name, greetings, attendance],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error saving RSVP");
      } else {
        res.send("RSVP submitted successfully!");
      }
    }
  );
});

// Admin route to view all RSVPs
app.get("/admin/rsvps", (req, res) => {
  db.all(`SELECT * FROM rsvp`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Serve the form HTML
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
