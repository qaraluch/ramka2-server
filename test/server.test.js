const supertest = require("supertest");
const app = require("../src/server");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
// this is workaround. check PR on github
// https://github.com/isaacs/rimraf/pull/185
const { connectDB, resetDB, closeDB, seedDBFirstTime } = require("../src/db");
require("dotenv").config();

beforeAll(async () => {
  try {
    await connectDB("local");
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
    await rimraf("./public/*");
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

describe(":: endpoint /images", () => {
  it("should successfully upload an image using POST method", async () => {
    const imgName = "image-walczak.jpg";
    const expectedResponseObj = {
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          imageUploadTimeStamp: expect.any(String),
          imageUploadTimeStampISO: expect.any(String),
          imageOriginalName: imgName,
          imageFileName: expect.any(String),
          imageServerPath: expect.stringMatching(/^public/),
          imageMimeType: "image/jpeg",
          imageSize: expect.any(Number),
        }),
      ]),
    };
    const res = await supertest(app)
      .post("/images")
      .field("Content-Type", "multipart/form-data")
      .attach("imageUpload", `test/fixtures/${imgName}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining(expectedResponseObj));
  });

  it("should successfully upload array of images using POST method", async () => {
    const imgName = [
      "image-walczak.jpg",
      "image-walczak-thesame.jpg",
      "image-icon.jpg",
    ];
    const res = await supertest(app)
      .post("/images")
      .field("Content-Type", "multipart/form-data")
      .attach("imageUpload", `test/fixtures/${imgName[0]}`)
      .attach("imageUpload", `test/fixtures/${imgName[1]}`)
      .attach("imageUpload", `test/fixtures/${imgName[2]}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ imageOriginalName: imgName[0] }),
        expect.objectContaining({ imageOriginalName: imgName[1] }),
        expect.objectContaining({ imageOriginalName: imgName[2] }),
      ])
    );
  });
});
