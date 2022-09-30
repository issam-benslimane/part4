const Blog = require("../models/blog");

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
  return new Blog({ title: "test", url: "test" }).toJSON().id;
};

const blogsInDB = async () => {
  const notes = await Blog.find({});
  return notes.map((r) => r.toJSON());
};

module.exports = { initialBlogs, blogsInDB, nonExistingId };
