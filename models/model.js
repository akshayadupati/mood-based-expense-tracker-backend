const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// categories : transactionMood, color
// transactions : expenseName, expenseType, transactionMood, transactionAmount

const categories_model = new Schema({
  transactionMood: { type: String, default: "Excited" },
  color: { type: String, default: "#58508d" },
});

const transaction_model = new Schema({
  expenseName: { type: String, default: "John Doe" },
  expenseType: { type: String, default: "Rental" },
  transactionMood: { type: String, default: "Excited" },
  transactionAmount: { type: Number }
});

const Categories = mongoose.model("categories", categories_model);
const Transaction = mongoose.model("transaction", transaction_model);

exports.default = Transaction;
module.exports = { Categories, Transaction };
