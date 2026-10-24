const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const MAX_LIMIT = 100;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds standard list/get/create/update/remove handlers for a Mongoose model.
 * All responses use the `{ success, data }` envelope.
 *
 * `list` returns every document unless `?page=` is given; then it returns one page plus
 * `meta: { page, limit, total, pages }`. `?q=` searches `searchFields`, and any `filters`
 * entry (query param → parser) narrows the result, e.g. `?read=false`.
 */
function crudFactory(Model, { label = "Item", sort = { createdAt: -1 }, searchFields = [], filters = {} } = {}) {
  const findOr404 = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw ApiError.notFound(`${label} not found`);
    return doc;
  };

  const buildQuery = (query) => {
    const where = {};
    const q = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
    if (q && searchFields.length) {
      const pattern = new RegExp(escapeRegex(q), "i");
      where.$or = searchFields.map((field) => ({ [field]: pattern }));
    }
    for (const [param, parse] of Object.entries(filters)) {
      if (typeof query[param] !== "string") continue;
      const value = parse(query[param]);
      if (value !== undefined) where[param] = value;
    }
    return where;
  };

  return {
    list: asyncHandler(async (req, res) => {
      const where = buildQuery(req.query);
      if (req.query.page === undefined) {
        const docs = await Model.find(where).sort(sort);
        return res.json({ success: true, data: docs });
      }

      const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
      const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
      const [docs, total] = await Promise.all([
        Model.find(where).sort(sort).skip((page - 1) * limit).limit(limit),
        Model.countDocuments(where),
      ]);
      res.json({ success: true, data: docs, meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
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

/** Query-param parser for boolean filters ("true" / "false"). */
crudFactory.boolean = (value) => (value === "true" ? true : value === "false" ? false : undefined);

module.exports = crudFactory;
