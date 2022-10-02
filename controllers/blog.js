const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { blogs: 0 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", userExtractor, async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const blogAdded = { ...body, user: user._id };
    const blog = await new Blog(blogAdded).save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) return res.json(blog);
    res.status(404).end();
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;
    const blogToDelete = await Blog.findById(id);
    const user = await User.findById(req.user.id);
    if (blogToDelete.user.toString() !== user._id.toString())
      return res
        .status(401)
        .json({ error: "only authorized users can delete this blog" });

    await blogToDelete.delete();
    user.blogs = user.blogs.filter((b) => b.toString() !== id);
    await user.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.put("/:id", userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const blog = await Blog.findById(id);
    if (blog.user.toString() !== user._id.toString())
      return res
        .status(401)
        .json({ error: "only authorized users can update this blog" });

    Object.assign(blog, req.body);
    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

async function userExtractor(req, res, next) {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = router;
