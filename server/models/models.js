const sequelize = require("../db.js");
const {DataTypes} = require("sequelize");


const User = sequelize.define("users", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false, defaultValue: "USER"},
})

const Brand = sequelize.define("brands", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Model = sequelize.define("models", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false, unique: true}
})

const Car = sequelize.define("cars", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    price: {type: DataTypes.INTEGER},
    year: {type: DataTypes.INTEGER, allowNull: false},
    horses: {type: DataTypes.INTEGER, allowNull: false},
    vin: {type: DataTypes.STRING, allowNull: false, unique: true},
    mileage: {type: DataTypes.INTEGER},
    status: {
        type: DataTypes.ENUM,
        values: ['available', 'maintenance','sold'],
        allowNull: false,
        defaultValue: 'available',
    },
    img: {type: DataTypes.STRING, allowNull: false},
    /*brand_id: {type: DataTypes.INTEGER, allowNull: false}, FOREIGN_KEY*/
})

const Reserve = sequelize.define("reserves", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    start_date: {type: DataTypes.DATE, allowNull: false},
    end_date: {type: DataTypes.DATE, allowNull: false},
}, {
    indexes: [
        {
            unique: true,
            fields: ['car_id', 'start_date', 'end_date'],
        },
        {
            unique: true,
            fields: ['user_id', 'start_date', 'end_date'],
        }
    ]
});


const Part = sequelize.define("parts", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    price: {type: DataTypes.INTEGER, allowNull: false}
})

const Maintenance = sequelize.define("maintenances", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    count: {type: DataTypes.INTEGER, allowNull: false},
    /*car_id: {type: DataTypes.INTEGER},
    part_id: {type: DataTypes.INTEGER},*/
    install_date: {type: DataTypes.DATEONLY, allowNull: false, defaultValue: null},
})

Car.hasMany(Maintenance, { foreignKey: 'car_id', onDelete: 'CASCADE' });
Maintenance.belongsTo(Car, { foreignKey: 'car_id' });

Part.hasMany(Maintenance, { foreignKey: 'part_id', onDelete: 'CASCADE' });
Maintenance.belongsTo(Part, { foreignKey: 'part_id' });

Brand.hasMany(Car, { foreignKey: 'brand_id', onDelete: 'CASCADE' });
Car.belongsTo(Brand, { foreignKey: 'brand_id' });

Brand.hasMany(Model, { foreignKey: 'brand_id', onDelete: 'CASCADE' });
Model.belongsTo(Brand, { foreignKey: 'brand_id' });

Model.hasMany(Car, { foreignKey: 'model_id', onDelete: 'CASCADE' });
Car.belongsTo(Model, { foreignKey: 'model_id' });

User.hasMany(Reserve, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reserve.belongsTo(User, { foreignKey: 'user_id' });

Car.hasMany(Reserve, { foreignKey: 'car_id', onDelete: 'CASCADE' });
Reserve.belongsTo(Car, { foreignKey: 'car_id' });





module.exports = {
    User, Brand, Car, Part, Maintenance,Model,Reserve
};
