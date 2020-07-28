const { parseCSFilenameFn } = require("../src/middlewares/parseCSFilename");

const uncorrectFilenames = [
  "image-walczak.jpg",
  "image-walczak-thesame.jpg",
  "image-icon.jpg",
  "1990-5.jpg",
  "2003.02.23_13.06.44.jpg",
  "2006-01-10 05-24-05.JPG",
  "2003-02-23_13.06.44.jpg",
  "2003-02-23_13-06-44.jpg",
  "2003-02-23.jpg",
];

const correctFilenames = [
  "2003-02-23 13.06.44.jpg",
  "2003-02-23 13.06.44-1.jpg",
  "2003-02-23 13.06.44-2 - Katowice - KAN.jpg",
  "2003-02-23 13.06.44-2 - KAN.jpg",
  "2003-02-23 13.06.44-2.jpg",
  "2003-02-23 13.06.44 - Katowice - KAN.jpg",
  "2003-02-23 13.06.44 - KAN.jpg",
  "2003-02-23 13.06.44-2-Katowice-KAN.jpg",
  "2003-02-23 13.06.44-Katowice-KAN.jpg",
];

// [ <error-message: null / {message: <msg>}>, <success: true / false>, <data>]
const responseNotMatch = [{ message: "No match!" }, false, null];
const responseMatch = [null, true, expect.anything()];

describe(":: parseCSFilenameFn() unit tests", () => {
  it("should parse correct full CS filename", async () => {
    const filename = "2003-02-23 13.06.44-2 - Katowice - KAN.jpg";
    const expected = {
      year: "2003",
      month: "02",
      day: "23",
      time: "13.06.44",
      version: "2",
      comment: "- Katowice - KAN",
      extension: ".jpg",
    };
    expect(parseCSFilenameFn(filename)).toEqual([null, true, expected]);
  });

  it("should not parse those CS filenames", async () => {
    uncorrectFilenames.forEach((filename) => {
      expect(parseCSFilenameFn(filename)).toEqual(responseNotMatch);
    });
  });

  it("should parse correctly those CS filenames", async () => {
    correctFilenames.forEach((filename) => {
      const parsed = parseCSFilenameFn(filename);
      // console.log(`${filename} -->`, parsed[2]);
      expect(parsed).toEqual(responseMatch);
    });
  });
});
