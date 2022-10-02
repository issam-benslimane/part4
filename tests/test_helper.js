const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const nonExistingId = async () => {
  return new Blog({ title: "test", url: "test" })._id;
};

const blogsInDB = async () => {
  const notes = await Blog.find({});
  return notes.map((r) => r.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((r) => r.toJSON());
};

module.exports = { initialBlogs, blogsInDB, usersInDb, nonExistingId };
