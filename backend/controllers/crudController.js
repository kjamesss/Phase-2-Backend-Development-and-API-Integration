const { HttpError } = require('../middleware/errorHandler');

function crudController(Model, label, prepare = async body => body) {
  const find = async id => {
    const resource = await Model.findById(id);
    if (!resource) throw new HttpError(404, `${label} not found`);
    return resource;
  };
  return {
    create: async (req, res) => res.status(201).json(await Model.create(await prepare(req.body))),
    list: async (req, res) => {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      if (!Number.isInteger(page) || page < 1 || !Number.isSafeInteger((page - 1) * limit)
          || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new HttpError(400, 'page must be positive and limit must be 1 to 100');
      }
      res.json(await Model.find().sort({ _id: 1 }).skip((page - 1) * limit).limit(limit));
    },
    get: async (req, res) => res.json(await find(req.params.id)),
    update: async (req, res) => {
      const resource = await find(req.params.id);
      Object.assign(resource, await prepare(req.body));
      await resource.save();
      res.json(resource);
    },
    remove: async (req, res) => {
      const removed = await Model.findByIdAndDelete(req.params.id);
      if (!removed) throw new HttpError(404, `${label} not found`);
      res.json({ message: `${label} deleted`, id: removed.id });
    }
  };
}

module.exports = crudController;
