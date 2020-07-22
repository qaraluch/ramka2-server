const { Router } = require("express");

const router = Router();

router.post("/", async (req, res, next) => {
  const data = await req.context.models.Image.create({
    imageName: req.body.imageName,
    imagePath: req.body.imagePath,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = router;
