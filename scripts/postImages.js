/*eslint no-console: "off"*/
// script:
// postImages.js
// node.js script that automatically upload
// images from sourceDir to the ramka2-server
// via POST /images route API
const walk = require("qm-walk");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

const sourceDir = process.env.POST_IMAGES_SOURCE;
const destinationUrl = process.env.POST_IMAGES_DESTINATION_URL;

const globOptions = { nocase: true };
const glob = ["*.jpg", "*.jpeg", "*.png", "*.gif"];

async function walkDir(path) {
  try {
    const walkOutputExt = await walk({ path });
    const fileExtended = walkOutputExt
      .getExtendedInfo()
      .match(glob, globOptions);
    const fileList = fileExtended.map((item) => item.isFile && item);
    return fileList;
  } catch (error) {
    throw new Error(
      `walker.js - sth. went wrong with walking a dir: ${path} on the disk. \n ${error.stack}`
    );
  }
}

(async () => {
  console.log("[ ramka2 scripts ] postImages");
  console.log("[ ramka2 scripts ] About to upload all images from: ");
  console.log("[ ramka2 scripts ]    ... form dir: %s", sourceDir);
  console.log(
    "[ ramka2 scripts ]    ... to the ramka2-server: %s",
    destinationUrl
  );
  try {
    const fileListExtended = await walkDir(sourceDir);
    console.log("[ ramka2 scripts ]    ... walked all files");

    console.log("[ ramka2 scripts ]    ... about to upload files");
    console.log("[ ramka2 scripts ]        ... ");
    const form = new FormData();
    fileListExtended.forEach((img) => {
      const stream = fs.createReadStream(img.path);
      form.append("imageUpload", stream);
    });
    const formHeaders = form.getHeaders();

    const response = await axios.post(destinationUrl, form, {
      // unlimited size of image data upload
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...formHeaders,
      },
    });

    const { status, statusText } = response;
    console.log("[ ramka2 scripts ] Uploaded all files...");
    console.log(
      "[ ramka2 scripts ]    ... with status: %s %s",
      status,
      statusText
    );
    // res API -v|v- server API
    response.data.data[0].forEach((img) => {
      console.log("                         ... %s", img.imageOriginalName);
    });

    console.log("[ ramka2 scripts ] [ Done! ]");
  } catch (error) {
    console.error(`Sth. went wrong: ... \n ${error}`);
    process.exit(1);
  }
})();
