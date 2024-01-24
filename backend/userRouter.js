const express = require("express");
const User = require("./userSchema.js");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { generateToken } = require("./util.js");
const userRoute = express();
userRoute.post(
  "/sign-up",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(404).send("Email already exists");
      return;
    }
    try {
      // const pass = req.body.password;
      // const saltRounds = bcrypt.genSaltSync(10);
      // const hashedPassword = await bcrypt.hashSync(pass, saltRounds);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
       });
      await newUser.save();
      res.send({
        user: newUser,
        token: generateToken(newUser),
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  })
);
userRoute.post(
  "/sign-in",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    console.log(user);
    if (!user) {
      res.status(404).send({ message: "Account not found!" });
      return;
    }
    try {
      const validPassword = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (validPassword) {
        const users = await User.findOne({ email: req.body.email });
        res.send({ user: user, token: generateToken(user) });
        return;
      } else {
        res.status(404).send({ message: "Invalid password!" });
        return;
      }
    } catch (err) {
      console.log(err);
    }
  })
);
module.exports = userRoute;
