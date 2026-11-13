const router = require('express').Router();
const controller = require('../controllers/productController');
const { validateId, validateBody } = require('../middleware/validate');
const fields = ['name', 'description', 'price', 'stock'];

router.route('/')
  .post(validateBody(fields, ['name', 'price']), controller.create)
  .get(controller.list);
router.route('/:id')
  .all(validateId)
  .get(controller.get)
  .put(validateBody(fields), controller.update)
  .delete(controller.remove);

module.exports = router;
