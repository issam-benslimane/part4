const User = require("../models/user");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await new User({ username: "root", password: "test" }).save();
});

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("creation succeeds with a fresh username", async () => {
  const usersAtStart = await helper.usersInDb();
  const newUser = { username: "ombrice", password: "password" };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const users = usersAtEnd.map((r) => r.username);
  expect(users).toContain(newUser.username);
});

test("creation fails if a username exists", async () => {
  const usersAtStart = await helper.usersInDb();
  const newUser = { username: "root", password: "password" };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("username already taken");

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test("creation fails if username isn't given", async () => {
  const newUser = { username: "", password: "password" };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("creation fails if password isn't given", async () => {
  const newUser = { username: "test", password: "" };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("password is required");
});

test("creation fails if password isn't less than 3 characters", async () => {
  const newUser = { username: "test", password: "45" };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("password must have atleast 3 characters");
});

afterAll(() => mongoose.connection.close());
