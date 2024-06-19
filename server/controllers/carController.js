const uuid = require('uuid');
const {Car, User} = require("../models/models");
const path = require('path');
const ApiError = require('../error/ApiError');

class CarController {
    async create(req, res, next) {
        try {
            const {brand_id, model_id, price, year, horses, vin, mileage, status} = req.body;

            if (!brand_id || !model_id || !price || !year || !horses || !vin || !mileage) {
                return next(ApiError.badRequest('Введены не все данные'));
            }

            const candidate = await Car.findOne({where: {vin: vin}});

            if (candidate && candidate.id != id) {
                return next(ApiError.badRequest('Автомобиль с данным VIN номером уже существует'));
            }

            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Фото не найдено'));
            }

            const {img} = req.files;
            const mimeType = img.mimetype;
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (!validMimeTypes.includes(mimeType)) {
                return next(ApiError.badRequest('Загружаемый файл должен быть изображением'));
            }

            let fileName = uuid.v4() + path.extname(img.name);

            img.mv(path.resolve(__dirname, '..', 'static', fileName), async (err) => {
                if (err) {
                    return next(ApiError.internal('Ошибка при загрузке изображения'));
                }

                try {
                    const newCar = await Car.create({
                        model_id: model_id,
                        price: price,
                        year: year,
                        horses: horses,
                        vin: vin,
                        mileage: mileage,
                        status: status,
                        img: fileName,
                        brand_id: brand_id
                    });

                    return res.json(newCar);
                } catch (err) {
                    return next(ApiError.internal('Ошибка при создании автомобиля'));
                }
            });
        } catch (err) {
            return next(ApiError.internal('Ошибка сервера'));
        }
    }

    async getAll(req, res) {
        let {brand_id, user_id, limit, page} = req.query;
        page = page || 1
        limit = limit || 40
        let offset = (page - 1) * limit;
        let cars;
        if (!brand_id && !user_id) {
            cars = await Car.findAndCountAll({limit, offset});
        } else if (brand_id && !user_id) {
            cars = await Car.findAndCountAll({where: {brand_id: brand_id}, limit, offset});
        } else if (!brand_id && user_id) {
            cars = await Car.findAndCountAll({where: {user_id: user_id}, limit, offset});
        } else {
            cars = await Car.findAndCountAll({where: {user_id: user_id, brand_id: brand_id}, limit, offset});
        }
        return res.json(cars);
    }

    async getOne(req, res) {
        const id = req.params.id;
        const car = await Car.findOne({where: {id}})
        res.json(car);
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const updateData = {};

            const {brand_id, model_id, price, year, horses, vin, mileage, status, user_id} = req.body;
            if (brand_id !== undefined) updateData.brand_id = brand_id;
            if (model_id !== undefined) updateData.model_id = model_id;
            if (price !== undefined) updateData.price = price;
            if (year !== undefined) updateData.year = year;
            if (horses !== undefined) updateData.horses = horses;
            if (vin !== undefined) updateData.vin = vin;
            if (mileage !== undefined) updateData.mileage = mileage;
            if (status !== undefined) updateData.status = status;
            if (user_id !== undefined) updateData.user_id = user_id;

            if (user_id == 0) updateData.user_id = null;

            // Проверка на существование автомобиля с данным vin номером
            if (vin !== undefined) {
                const candidate = await Car.findOne({where: {vin}});

                if (candidate && candidate.id != id) {
                    return next(ApiError.badRequest('Автомобиль с данным VIN номером уже существует'));
                }
            }

            if (req.files && req.files.img) {
                const img = req.files.img;
                const mimeType = img.mimetype;
                const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

                if (!validMimeTypes.includes(mimeType)) {
                    return next(ApiError.badRequest('Загружаемый файл должен быть изображением'));
                }

                const fileName = uuid.v4() + +".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', fileName), (err) => {
                    if (err) {
                        return next(ApiError.internal('Ошибка при загрузке изображения'));
                    }
                });
                updateData.img = fileName;
            }

            const [affectedRows] = await Car.update(updateData, {where: {id}});

            if (affectedRows === 0) {
                return res.status(404).json({message: "Машина не найдена"});
            }

            return res.json({updateData});
        } catch (error) {
            console.error("Ошибка при обновлении машины:", error);
            next(ApiError.internal('Ошибка при обновлении машины'));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            if (id == 0){
                return next(ApiError.badRequest('Выберите автомобиль'))
            }
            const car = await Car.destroy({where: {id}})
            res.json(car);
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении машины'));
        }

    }
}

module.exports = new CarController();