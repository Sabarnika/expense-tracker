const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const expenseRouter = require("./expenseRouter");
const userRouter = require("./userRouter");
const app = express();
dotenv.config();
app.use(cors(
  {
    origin:"https://expense-tracker-mern-kohl.vercel.app/",
    methods:["GET","POST","PUT","DELETE"],
  }
));
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*")
  next()
})
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
