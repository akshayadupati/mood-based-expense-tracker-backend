const mongoose = require("mongoose");

const connection = mongoose
  .connect(process.env.ATLAS_URI)
  .then((db) => {
    console.log("Database connected!");
    return db;
  })
  .catch((err) => {
    console.log("Connection error", err);
  });

  module.exports = connection;