const {Part, Car, Brand} = require("../models/models");
const ApiError = require("../error/ApiError");

class PartController {
    async create(req, res, next) {
        try {
            const {name, price} = req.body;
            if (!name || !price) {
                return next(ApiError.badRequest('Введены не все данные'))
            }
            const candidate = await Part.findOne({where: {name}});

            if (candidate && candidate.id != id) {
                return next(ApiError.badRequest('Деталь с таким названием уже существует'));
            }

            const newPart = await Part.create({name, price})
            return res.json(newPart)
        } catch (err) {
            return next(ApiError.internal('Ошибка при создании детали'));
        }

    }

    async getAll(req, res) {
        const allParts = await Part.findAll();
        return res.json(allParts);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const part = await Part.findOne({where: {id}});
        return res.json(part);
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            if (id == 0) {
                return next(ApiError.badRequest('Выберите деталь'))
            }
            const {name, price} = req.body;
            if (!name || !price) {
                return next(ApiError.badRequest('Вы ввели не все данные'))
            }
            const candidate = await Part.findOne({where: {name}});

            if (candidate && candidate.id != id) {
                return next(ApiError.badRequest('Деталь с таким названием уже существует'));
            }

            const part = await Part.update(
                {
                    name: name,
                    price: price
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            return res.json(part);
        } catch (e) {
            return next(ApiError.internal('Ошибка при изменении детали'));
        }

    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            if (id == 0) {
                return next(ApiError.badRequest('Выберите деталь'))
            }
            const part = await Part.destroy({where: {id}});
            return res.json(part);
        } catch (e) {
            return next(ApiError.internal('Ошибка удаления детали'))
        }

    }
}

module.exports = new PartController();