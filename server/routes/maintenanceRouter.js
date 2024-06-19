const Router = require("express");
const router = new Router();
const maintenanceController = require("../controllers/maintenanceController");
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/', checkRole("ADMIN"), maintenanceController.create);
router.get('/', maintenanceController.getAll)
router.put('/:id', checkRole("ADMIN"), maintenanceController.update)
router.delete('/:id', checkRole("ADMIN"), maintenanceController.delete)

module.exports = router;