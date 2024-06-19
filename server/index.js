require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();
process.env.TZ = 'Asia/Yekaterinburg';
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use('/api', router);


app.use(errorHandler); //последний, обработка ошибок
const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }catch(e){
        console.log(e);
    }
}

start();