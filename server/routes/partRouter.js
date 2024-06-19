const Router = require("express");
const router = new Router();
const partController = require("../controllers/partController");
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/', checkRole("ADMIN"), partController.create)
router.get('/', partController.getAll)
router.get('/:id', partController.getOne)
router.put('/:id', checkRole("ADMIN"), partController.update)
router.delete('/:id', checkRole("ADMIN"), partController.delete)

module.exports = router;