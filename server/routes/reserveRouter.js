const Router = require("express");
const router = new Router();
const reserveController = require("../controllers/reserveController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', reserveController.create);
router.get('/', reserveController.getAll)
router.get('/:id',reserveController.getOne)
router.put('/:id', reserveController.update)
router.delete('/:id', reserveController.delete)

module.exports = router;
