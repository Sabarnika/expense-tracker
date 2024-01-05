const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
  {
    reason: String,
    amount: Number,
    date: Date,
  },
  { timestamps: true }
);
const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
