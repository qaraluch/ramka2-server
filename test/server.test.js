const supertest = require("supertest");
const app = require("../src/server");
const { connectDB, resetDB, closeDB, seedDBFirstTime } = require("../src/db");
require("dotenv").config();
const res = supertest(app);

beforeAll(async () => {
  try {
    await connectDB();
    await resetDB();
    await seedDBFirstTime();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});

afterAll(async () => {
  try {
    await closeDB();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});

describe(":: basic server responds", () => {
  it("should respond for GET / request with walcome json message", async () => {
    const res = await supertest(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(typeof res.body.message).toBe("string");
  });

  it("should respond for GET /not-valid route with error json message", async () => {
    const res = await supertest(app)
      .get("/not-valid")
      .expect("Content-Type", /json/)
      .expect(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringMatching("Not Found"),
        stack: expect.anything(),
      })
    );
  });
});

// describe(":: session endpoint", () => {});
