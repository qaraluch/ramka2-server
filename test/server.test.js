const supertest = require("supertest");
const app = require("../src/server");
const fs = require("fs");
const { promisify } = require("util");
const stats = promisify(fs.stat);
const rimraf = promisify(require("rimraf"));
// this is workaround. check PR on github
// https://github.com/isaacs/rimraf/pull/185
const { connectDB, resetDB, closeDB, seedDBFirstTime } = require("../src/db");
require("dotenv").config();

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
    await rimraf(process.env.STORAGE_PATH_TEST);
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
  const imgName = [
    "2018-08-27 19.27.28-0 - słowenia - zagrzeb.jpg",
    "image-walczak.jpg",
    "image-walczak-thesame.jpg",
    "image-icon.jpg",
  ];

  it("should successfully upload an image using POST method", async () => {
    const expectedResponseObj = {
      success: true,
      // data API: [dbImageRecords, dbUploadRecord],
      // see: routes/images.js
      data: expect.arrayContaining([
        // dbImageRecords
        expect.arrayContaining([
          expect.objectContaining({
            imageUploadTimestamp: expect.any(String),
            imageUploadTimestampISO: expect.any(String),
            imageOriginalName: imgName[0],
            imageFileName: expect.any(String),
            imageServerPath: expect.stringMatching(/^public/),
            imageMimeType: "image/jpeg",
            imageSize: expect.any(Number),
          }),
        ]),
        // dbUploadRecord
        expect.objectContaining({ images: expect.any(Array) }),
      ]),
    };
    const res = await supertest(app)
      .post("/images")
      .field("Content-Type", "multipart/form-data")
      .attach("imageUpload", `test/fixtures/${imgName[0]}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining(expectedResponseObj));
    expect(res.body.data[1].images.length).toBe(1); // dbUploadRecord
  });

  it("should successfully upload array of images using POST method", async () => {
    const res = await supertest(app)
      .post("/images")
      .field("Content-Type", "multipart/form-data")
      .attach("imageUpload", `test/fixtures/${imgName[1]}`)
      .attach("imageUpload", `test/fixtures/${imgName[2]}`)
      .attach("imageUpload", `test/fixtures/${imgName[3]}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].length).toBe(3); // dbImageRecords see: routes/images.js
    expect(res.body.data[1].images.length).toBe(3); // dbUploadRecord
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({ imageOriginalName: imgName[1] }),
          expect.objectContaining({ imageOriginalName: imgName[2] }),
          expect.objectContaining({ imageOriginalName: imgName[3] }),
        ]),
      ])
    );
  });

  it("should successfully save uploaded files (original and thumbnail) to the public dir", async () => {
    const res = await supertest(app)
      .get("/images")
      .expect("Content-Type", /json/)
      .expect(200);
    const originalImagePath = res.body.data[0].imageServerPath;
    const thumbnailImagePath = res.body.data[0].thumbnail.path;
    const isFile = async (filePath) => {
      const st = await stats(filePath);
      return st.isFile();
    };
    const statsIsFileArr = await Promise.all([
      isFile(originalImagePath),
      isFile(thumbnailImagePath),
    ]);
    expect(statsIsFileArr).toEqual([true, true]);
  });

  //TODO: to remove in favour of /collections endpoint ? (think of it)
  it("should successfully GET all records of image info", async () => {
    const res = await supertest(app)
      .get("/images")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ imageOriginalName: imgName[0] }),
        expect.objectContaining({ imageOriginalName: imgName[1] }),
        expect.objectContaining({ imageOriginalName: imgName[2] }),
        expect.objectContaining({ imageOriginalName: imgName[3] }),
      ])
    );
  });

  it("should successfully GET image info by passing image _id as request parameter", async () => {
    const res = await supertest(app)
      .get("/images")
      .expect("Content-Type", /json/)
      .expect(200);
    const imageId = res.body.data[0]._id;
    const res2 = await supertest(app)
      .get(`/images/${imageId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.data.length).toBe(1);
    expect(res2.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ imageOriginalName: imgName[0] }),
      ])
    );
  });

  it("should successfully GET additonal info of image generated by middlewares", async () => {
    const res = await supertest(app)
      .get("/images")
      .expect("Content-Type", /json/)
      .expect(200);
    const info = res.body.data[0];
    const imageId = info._id;
    const imageServerPath = info.imageServerPath;
    const res2 = await supertest(app)
      .get(`/images/${imageId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.data.length).toBe(1);
    expect(res2.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ imageOriginalName: imgName[0] }),
        expect.objectContaining({
          thumbnail: expect.objectContaining({
            path: `${imageServerPath}_small`,
          }),
        }),
        expect.objectContaining({
          imageHash: expect.objectContaining({
            data: expect.any(String),
          }),
        }),
        expect.objectContaining({
          imageExif: expect.objectContaining({
            data: expect.objectContaining({ SourceFile: imageServerPath }),
          }),
        }),
        expect.objectContaining({
          parsedCSFilename: expect.objectContaining({
            data: expect.objectContaining({ year: "2018" }),
          }),
        }),
      ])
    );
  });

  it("should get not found message when passing wrong image _id as request parameter (id wrong format)(GET request)", async () => {
    const res = await supertest(app)
      .get("/images/123")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: expect.stringMatching("Not found in the DB image with _id:"),
      })
    );
  });

  it("should get not found message when passing wrong image _id as request parameter (id not exists)(GET request)", async () => {
    const res = await supertest(app)
      .get("/images/11119879a7c1ce5e9862a639")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: expect.stringMatching("Not found in the DB image with _id:"),
      })
    );
  });
});

describe(":: endpoint /collections", () => {
  it("should successfully GET all records of 'all' collection (in order whitin upload sessions)", async () => {
    const res = await supertest(app)
      .get("/collections/all")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("all");
    expect(res.body.data.images.length).toBe(4);

    const imageInfo = await Promise.all(
      res.body.data.images.map(async (id) => {
        const res = await supertest(app)
          .get(`/images/${id}`)
          .expect("Content-Type", /json/)
          .expect(200);
        return res.body;
      })
    );
    const getTimestamp = (itm) => parseInt(itm.data[0].imageUploadTimestamp);
    const timestamps = imageInfo.map(getTimestamp);
    const [img1ts, img2ts, img3ts, img4ts] = timestamps;

    // At this point of this test sequence we have 2 uploads already
    // older upload  (1 image) should be with image that timestamp is the oldest
    // newest upload (3 images) should be with all images that timestamp is newer than image in old upload
    // so:
    // [
    //  image1: older than image1 and image2 but not than image4
    //  image2: newer than image1
    //  image3: newer than image2
    //  image4: older than then all above
    // ]
    // this is correct order of timestamps:
    // timestamps ----> [ '1596624770214', '1596624770215', '1596624770216', '1596624769241' ]
    expect(img1ts).toBeLessThanOrEqual(img2ts); // in rare cases it can be equal (the same upload session)
    expect(img1ts).toBeLessThan(img3ts);
    expect(img1ts).toBeGreaterThan(img4ts);
  });

  it("should get not found message when passing wrong collection name as request parameter (GET request)", async () => {
    const res = await supertest(app)
      .get("/collections/pierogi")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: expect.stringMatching(
          "Not found in the DB collection with name:"
        ),
      })
    );
  });
});
