const { Router } = require("express");

const router = Router();

router.get("/", async (req, res, next) => {
  const users = await req.context.models.User.find().catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.json(users);
});

router.get("/:userId", async (req, res, next) => {
  const user = await req.context.models.User.findById(req.params.userId).catch(
    (error) => {
      error.statusCode = 400;
      next(error);
    }
  );
  return res.json(user);
});

module.exports = router;
