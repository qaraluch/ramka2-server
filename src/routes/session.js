const { Router } = require("express");

const router = Router();

router.get("/", async (req, res, next) => {
  const user = await req.context.models.User.findById(req.context.me.id).catch(
    (error) => {
      error.statusCode = 400;
      next(error);
    }
  );
  return res.send(user);
});

module.exports = router;
