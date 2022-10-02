const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs", { user: 0, likes: 0 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const isUserExisting = await User.findOne({ username });
    if (isUserExisting)
      return res.status(400).json({ error: "username already taken" });

    if (!password.trim())
      return res.status(400).json({ error: "password is required" });

    if (password.length < 3)
      return res
        .status(400)
        .json({ error: "password must have atleast 3 characters" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await new User({ username, name, passwordHash }).save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
