const {Maintenance, Part, Car} = require("../models/models");
const ApiError = require("../error/ApiError");

class MaintenanceController {
    async create(req, res, next) {
        try {
            const {install_date, count, car_id, part_id} = req.body;
            if (!install_date || !count || !car_id || !part_id) {
                return next(ApiError.badRequest('Введите все данные!'))
            }
            const newMaintenance = await Maintenance.create({install_date, count, car_id, part_id})
            return res.json(newMaintenance)
        } catch (err) {
            return next(ApiError.badRequest('Ошибка при добавлении записи ТО'));
        }

    }

    async getAll(req, res) {
        let {car_id} = req.query;
        let maintenance;
        if (!car_id) {
            maintenance = await Maintenance.findAll();
        } else {

            maintenance = await Maintenance.findAll({where: {car_id: car_id}});
        }
        return res.json(maintenance);
    }

    async update(req, res,next) {
        try {
            const {id} = req.params;
            if (id == 0){
                return next(ApiError.badRequest('Выберите запись'))
            }
            const {install_date, count, car_id, part_id} = req.body;
            if (!install_date || !count || !car_id || !part_id) {
                return next(ApiError.badRequest('Введите все данные!'))
            }
            const maintenance = await Maintenance.update({install_date, count, car_id, part_id}, {where: {id}});
            return res.json(maintenance);
        } catch (e) {
            return next(ApiError.badRequest('Ошибка при изменения записи ТО'));
        }

    }

    async delete(req, res) {
        try{
            const {id} = req.params;
        const maintenance = await Maintenance.destroy({where: {id}})
        res.json(maintenance);
        }catch (e) {
            return next(ApiError.badRequest('Ошибка при удалении записи ТО'));
        }


    }
}


module.exports = new MaintenanceController();