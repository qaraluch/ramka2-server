const { Router } = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const middlewares = require("../middlewares");

//TODO: move to providers section in the future?

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    const id = uuid();
    cb(null, id);
  },
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8, // 8Mb
  },
  fileFilter: fileFilter,
});

router.post(
  "/",
  upload.array("imageUpload"),
  middlewares.cropSquareThumbnailImage,
  middlewares.getExifData,
  middlewares.getHash,
  middlewares.parseCSFilename,
  async (req, res, next) => {
    const dbRecords = await multiCreateDBRecords(req, next);
    return res.status(200).json({
      success: true,
      data: dbRecords,
    });
  }
);

function multiCreateDBRecords(req, next) {
  return Promise.all(
    req.files.map(async (file) => {
      const dbRecord = await req.context.models.Image.create({
        imageOriginalName: file.originalname,
        imageFileName: file.filename,
        imageServerPath: file.path,
        imageMimeType: file.mimetype,
        imageSize: file.size,
        imageExif: {
          exifResults: {
            success: file.exifData.success,
            message: file.exifData.message,
          },
          data: file.exifData.data,
        },
        thumbnail: {
          cropResults: {
            success: file.thumbnailCropResults.success,
            message: file.thumbnailCropResults.message,
          },
          path: file.thumbnailCropResults.path,
        },
        imageHash: {
          hashResults: {
            success: file.imageHash.success,
            message: file.imageHash.message,
          },
          data: file.imageHash.data,
        },
        parsedCSFilename: {
          parseResults: {
            success: file.parsedCSFilename.success,
            message: file.parsedCSFilename.message,
          },
          data: file.parsedCSFilename.data,
        },
      }).catch((error) => {
        error.statusCode = 400;
        next(error);
      });
      return dbRecord;
    })
  );
}

router.get("/", async (req, res, next) => {
  const imagesInfo = await req.context.models.Image.find().catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.send({ success: true, data: imagesInfo });
});

router.get("/:imageId", async (req, res, next) => {
  const imageId = req.params.imageId;
  const imageInfo = await req.context.models.Image.findById(imageId).catch(
    (error) => {
      error.statusCode = 400;
      next(error);
    }
  );
  if (!imageInfo)
    return res.send({
      success: false,
      message: `Not found in the DB image with _id: ${imageId}`,
    });
  return res.send({ success: true, data: [imageInfo] });
});

module.exports = router;
