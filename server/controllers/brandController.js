const {Brand, Car} = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
    async create(req, res, next) {
        try {
            const {title} = req.body;

            if (!title) {
                return next(ApiError.badRequest('Введите название марки'));
            }

            const candidate = await Brand.findOne({where: {title}});

            if (candidate) {
                return next(ApiError.badRequest('Марка с данным названием уже существует'));
            }

            const newBrand = await Brand.create({title});
            return res.json(newBrand);
        } catch (err) {
            return next(ApiError.internal('Ошибка при создании марки'));
        }
    }

    async getAll(req, res) {
        const allBrands = await Brand.findAll();
        return res.json(allBrands);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const brand = await Brand.findOne({where: {id}});
        return res.json(brand);
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {title} = req.body;

            if (!title || id == 0) {
                return next(ApiError.badRequest('Введены не все данные'));
            }

            const candidate = await Brand.findOne({where: {title}});
            if (candidate && candidate.id != id) {
                return next(ApiError.badRequest('Марка с данным названием уже существует'));
            }

            const [updatedRowsCount] = await Brand.update({title}, {where: {id}});
            if (updatedRowsCount === 0) {
                return next(ApiError.notFound('Марка не найдена'));
            }

            const updatedBrand = await Brand.findOne({where: {id}});
            return res.json(updatedBrand);
        } catch (err) {
            return next(ApiError.internal('Ошибка при обновлении марки'));
        }
    }

    async delete(req, res,next) {
        try {
            const {id} = req.params;
            if (id == 0){
                return next(ApiError.badRequest('Введены не все данные'));
            }
            const brand = await Brand.destroy({where: {id}});
            return res.json(brand);
        } catch (e) {
            return next(ApiError.internal('Ошибка при обновлении марки'));
        }

    }
}

module.exports = new BrandController();
