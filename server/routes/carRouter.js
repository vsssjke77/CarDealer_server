const Router = require("express");
const router = new Router();
const carController = require("../controllers/carController");
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/', checkRole("ADMIN"), carController.create);
router.get('/', carController.getAll)
router.get('/:id',carController.getOne)
router.put('/:id', carController.update)
router.delete('/:id', checkRole("ADMIN"), carController.delete)

module.exports = router;