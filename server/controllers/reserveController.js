const {Reserve, Car} = require("../models/models");
const ApiError = require("../error/ApiError");

class ReserveController {
    async create(req, res, next) {
        try {
            const {start_date, end_date, user_id, car_id} = req.body;
            const newReserve = await Reserve.create({start_date, end_date, user_id, car_id})
            return res.json(newReserve)
        } catch (e) {
            next(ApiError.badRequest('Не удалось забронировать на данное время'))
        }

    }

    async getAll(req, res) {
        let {user_id, car_id} = req.query;
        let reserves;
        if (!user_id && !car_id) {
            reserves = await Reserve.findAll();
        } else if (user_id && !car_id) {
            reserves = await Reserve.findAll({where: {user_id: user_id}});
        } else if (!user_id && car_id) {
            reserves = await Reserve.findAll({where: {car_id: car_id}});
        } else {
            reserves = await Reserve.findAll({where: {user_id: user_id, car_id: car_id}});
        }

        return res.json(reserves);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const reserve = await Reserve.findOne({where: {id}});
        return res.json(reserve);
    }

    async update(req, res) {
        const {id} = req.params;
        const {start_date, end_date, user_id, car_id} = req.body;
        const reserve = await Reserve.update({start_date, end_date, user_id, car_id}, {where: {id: id}});
        return res.json(reserve);
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            if (id == 0){
                return next(ApiError.badRequest('Выберите резервацию'))
            }
            const reserve = await Reserve.destroy({where: {id}});
            return res.json(reserve);
        } catch (e) {
            return next(ApiError.badRequest('Ошибка при удалении резервации'))
        }

    }
}

module.exports = new ReserveController();
