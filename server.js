const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connection = require("./db/connection");

app.use(require("./routes/route"));

connection
  .then((db) => {
    if (!db) return process.exit(1);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    app.on("error", (err) => console.log("Failed to connect", err));
  })
  .catch((err) => {
    console.log("Mongo DB connection error", err);
  });
