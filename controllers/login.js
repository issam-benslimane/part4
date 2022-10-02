const loginRouter = require("express").Router();
const jws = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.passwordHash));
    if (!isPasswordCorrect)
      return res.status(401).json({ error: "username or password incorrect" });

    const token = jws.sign({ username, id: user._id }, process.env.SECRET);
    res.send({ token, username });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
