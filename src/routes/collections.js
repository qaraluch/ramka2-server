const { Router } = require("express");

const router = Router();

//TODO: in the root of this rout list all names of the collections?
// router.get("/", async (req, res, next) => {
//   const imagesInfo = await req.context.models.Image.find().catch((error) => {
//     error.statusCode = 400;
//     next(error);
//   });
//   return res.send({ success: true, data: imagesInfo });
// });

router.get("/:collectionName", async (req, res, next) => {
  const { collectionName } = req.params;
  const unsuccessfulResponse = {
    success: false,
    message: `Not found in the DB collection with name: ${collectionName}`,
  };
  const collectionData = await req.context.models.Collection.find({
    name: collectionName,
  })
    .exec()
    /* eslint-disable no-unused-vars */
    .catch((error) => {
      // swallow the error
      return;
    });
  // find methods always returns array
  // when not found it returns empty array
  // so only if (!collectionData) is not enough
  if ((collectionData && collectionData.length === 0) || !collectionData)
    return res.send(unsuccessfulResponse);
  return res.send({ success: true, data: collectionData[0] });
});

module.exports = router;
