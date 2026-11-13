const router = require('express').Router();
const controller = require('../controllers/userController');
const { validateId, validateBody } = require('../middleware/validate');
const fields = ['name', 'email', 'password', 'role'];

router.route('/')
  .post(validateBody(fields, ['name', 'email', 'password']), controller.create)
  .get(controller.list);
router.route('/:id')
  .all(validateId)
  .get(controller.get)
  .put(validateBody(fields), controller.update)
  .delete(controller.remove);

module.exports = router;
