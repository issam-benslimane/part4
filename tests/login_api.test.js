const User = require("../models/user");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await api.post("/api/users").send({ username: "root", password: "test" });
});

test("user succeeds to login if given correct username and password", async () => {
  const loginInfo = { username: "root", password: "test" };
  const response = await api.post("/api/login").send(loginInfo).expect(200);

  expect(response.body.token).toBeDefined();
  expect(response.body.username).toBeDefined();
});

test("user fails to login if given incorrect username", async () => {
  const loginInfo = { username: "incorrectUsername", password: "test" };
  const response = await api
    .post("/api/login")
    .send(loginInfo)
    .expect(401)
    .expect("content-type", /application\/json/);

  expect(response.body.error).toBe("username or password incorrect");
  expect(response.body.token).not.toBeDefined();
  expect(response.body.username).not.toBeDefined();
});

test("user fails to login if given incorrect password", async () => {
  const loginInfo = { username: "root", password: "incorrectPassword" };
  const response = await api
    .post("/api/login")
    .send(loginInfo)
    .expect(401)
    .expect("content-type", /application\/json/);

  expect(response.body.error).toBe("username or password incorrect");
  expect(response.body.token).not.toBeDefined();
  expect(response.body.username).not.toBeDefined();
});

afterAll(() => mongoose.connection.close());
