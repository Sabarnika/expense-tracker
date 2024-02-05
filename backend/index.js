const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const expenseRouter = require("./expenseRouter");
const userRouter = require("./userRouter");
const app = express();
dotenv.config();
const corsOptions = {
  origin: ["https://expense-tracker-mern-stack.vercel.app"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
console.log("HI");
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/",(req,res)=>
  {
    res.json("Hello");
  })
app.options("*", cors(corsOptions));
app.use("/user",userRouter);
app.use("/expense-tracker", expenseRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
