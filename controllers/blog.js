const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", (req, res, next) => {
  Blog.find({}).then(res.json.bind(res)).catch(next);
});

router.post("/", (req, res, next) => {
  const blog = new Blog(req.body);
  blog.save().then((blogs) => res.status(201).json(blogs));
});

module.exports = router;
