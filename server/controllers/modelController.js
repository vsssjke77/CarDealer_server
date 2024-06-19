const {Model, Car} = require("../models/models");
const ApiError = require("../error/ApiError");

class ModelController {
    async create(req, res, next) {
        try {
            const {title, brand_id} = req.body;

            if (!title || !brand_id) {
                return next(ApiError.badRequest('Не все данные были представлены'));
            }
            const candidate = await Model.findOne({where: {title:title}});

            if (candidate) {
                return next(ApiError.badRequest('Модель с данным названием уже существует'));
            }

            const newModel = await Model.create({title, brand_id});
            return res.json(newModel);
        } catch (err) {
            return next(ApiError.internal('Ошибка при создании модели'));
        }
    }

    async getAll(req, res) {
        let {brand_id} = req.query;
        let models;
        if (!brand_id) {
            models = await Model.findAll({})
        } else {
            models = await Model.findAll({where: {brand_id: brand_id}});
        }

        return res.json(models);
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {title, brand_id} = req.body;

            if (!title || !brand_id || id == 0) {
                return next(ApiError.badRequest('Не все данные были представлены'));
            }

            const candidate = await Model.findOne({where: {title}});

            if (candidate && candidate.id != id) {
                return next(ApiError.badRequest('Модель с данным названием уже существует'));
            }


            const [affectedRows] = await Model.update({title, brand_id}, {where: {id}});

            if (affectedRows === 0) {
                return next(ApiError.badRequest('Модель не найдена'));
            }

            const updatedModel = await Model.findByPk(id);
            return res.json(updatedModel);
        } catch (err) {
            return next(ApiError.internal('Ошибка при изменении модели'));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            if (id == 0) {
                return next(ApiError.badRequest('Выберите модель'));
            }
            const model = await Model.destroy({where: {id}});
            return res.json(model);
        } catch (e) {
            return next(ApiError.internal('Ошибка при удалении модели'));
        }

    }
}

module.exports = new ModelController();
