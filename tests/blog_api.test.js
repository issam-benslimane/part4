const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Promise.all(helper.initialBlogs.map((blog) => new Blog(blog).save()));
});

describe("when there is initially some blogs saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("content-type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is whithin blogs", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("React patterns");
  });

  test("each blog document has an id property", async () => {
    const blogs = await helper.blogsInDB();
    blogs.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogs = await helper.blogsInDB();
    const blogToView = blogs[0];
    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("content-type", /application\/json/);
    expect(response.body).toEqual(blogToView);
  });

  test("fails with status 404 if blog does not exist", async () => {
    const id = await helper.nonExistingId();
    await api.get(`/api/blogs/${id}`).expect(404);
  });

  test("fails with status 400 if id is invalid", async () => {
    const invalidId = "5qs54dq4d4df56";
    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a note", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("content-type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain("First class tests");
  });
  test("likes property defaults to 0 if not specified", async () => {
    const newBlog = {
      title: "second class tests",
      author: "Robert C. Martin",
      url: "http://blog.medium.com/uncle-bob/2018/05/05/TestDefinitions.html",
    };
    await api.post("/api/blogs").send(newBlog);

    const blogsAtEnd = await helper.blogsInDB();
    const blogAdded = blogsAtEnd.find((blog) => blog.url === newBlog.url);
    expect(blogAdded.likes).toBeDefined();
    expect(blogAdded.likes).toBe(0);
  });
  test("blog without title or url is not added", async () => {
    await api.post("/api/blogs").send({ title: "", url: "url" }).expect(400);
    await api.post("/api/blogs").send({ title: "title", url: "" }).expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    expect(
      blogsAtEnd.find((blog) => blog.url === blogToDelete.url)
    ).not.toBeDefined();
  });
});

describe("update a blog", () => {
  test("update blog", async () => {
    const dummyBlog = {
      title: "second class tests",
      author: "Robert C. Martin",
      url: "http://blog.medium.com/uncle-bob/2018/05/05/TestDefinitions.html",
    };
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(dummyBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    const urls = blogsAtEnd.map((r) => r.url);
    expect(urls).toHaveLength(helper.initialBlogs.length);
    expect(urls).toContain(dummyBlog.url);
    expect(urls).not.toContain(blogToUpdate.url);
  });
});

afterAll(() => mongoose.connection.close());
