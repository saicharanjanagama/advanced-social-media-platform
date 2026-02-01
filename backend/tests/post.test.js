import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { connectDB, closeDB } from "./db.js";

let token;
let postId;

beforeAll(async () => {
  await connectDB();

  // ⛔ DO NOT call auth API here
  // ✅ Create user directly
  const user = await User.create({
    name: "Post Tester",
    email: "post@test.com",
    password: "password123"
  });

  token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await closeDB();
});

describe("Post API", () => {
  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Hello test post" });

    expect(res.statusCode).toBe(201);
    postId = res.body._id;
  });

  it("should like a post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.likesCount).toBe(1);
  });

  it("should unlike the post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.likesCount).toBe(0);
  });

  it("should delete own post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
