const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Builds standard list/get/create/update/remove handlers for a Mongoose model.
 * All responses use the `{ success, data }` envelope.
 */
function crudFactory(Model, { label = "Item", sort = { createdAt: -1 } } = {}) {
  const findOr404 = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw ApiError.notFound(`${label} not found`);
    return doc;
  };

  return {
    list: asyncHandler(async (req, res) => {
      const docs = await Model.find().sort(sort);
      res.json({ success: true, data: docs });
    }),

    get: asyncHandler(async (req, res) => {
      res.json({ success: true, data: await findOr404(req.params.id) });
    }),

    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, message: `${label} created`, data: doc });
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await findOr404(req.params.id);
      doc.set(req.body);
      await doc.save();
      res.json({ success: true, message: `${label} updated`, data: doc });
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await findOr404(req.params.id);
      await doc.deleteOne();
      res.json({ success: true, message: `${label} deleted` });
    }),
  };
}

module.exports = crudFactory;
