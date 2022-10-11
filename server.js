const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log("process.env.ATLAS_URI", process.env.ATLAS_URI);
const connection = mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true
  })
  .then((db) => {
    console.log("Database connected!");
    return db;
  })
  .catch((err) => {
    console.log("Connection error", err);
  });

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
