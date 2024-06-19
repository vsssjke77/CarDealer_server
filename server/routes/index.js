const Router = require("express");
const router = new Router();
const carRouter = require("./carRouter");
const userRouter = require("./userRouter");
const partRouter = require("./partRouter");
const maintenanceRouter = require("./maintenanceRouter");
const brandRouter = require("./brandRouter");
const modelRouter = require("./modelRouter");
const reserveRouter = require("./reserveRouter");


router.use('/user', userRouter);
router.use('/car', carRouter);
router.use('/part', partRouter);
router.use('/maintenance', maintenanceRouter);
router.use('/brand', brandRouter);
router.use('/model', modelRouter);
router.use('/reserve', reserveRouter);

module.exports = router;