const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
userRouter.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hashSync(password, 10);
    const newUser = new userSchema({
      name: name,
      email: email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ user: savedUser });
  } catch (err) {
    console.log(err);
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userSchema.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkValid = await bcrypt.compare(password, existingUser.password);
    if (!checkValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    res.status(200).json({ message: "Login Successfull" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = userRouter;
