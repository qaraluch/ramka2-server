const { Router } = require("express");
const multer = require("multer");
const { getDate } = require("../utils/time");
const { v4: uuid } = require("uuid");

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

router.post("/", upload.array("imageUpload"), async (req, res, next) => {
  const dbRecords = await multiCreateDBRecords(req, next);
  return res.status(200).json({
    success: true,
    data: dbRecords,
  });
});

function multiCreateDBRecords(req, next) {
  return Promise.all(
    req.files.map(async (file) => {
      const currentDate = new Date();
      const currentDateMs = currentDate.getTime();
      const dbRecord = await req.context.models.Image.create({
        imageUploadTimeStamp: currentDateMs,
        imageUploadTimeStampISO: getDate(currentDateMs),
        imageOriginalName: file && file.originalname,
        imageFileName: file && file.filename,
        imageServerPath: file && file.path,
        imageMimeType: file && file.mimetype,
        imageSize: file && file.size,
      }).catch((error) => {
        error.statusCode = 400;
        next(error);
      });
      return dbRecord;
    })
  );
}

module.exports = router;
