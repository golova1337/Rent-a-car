const express  = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const options = require('./api/api-doc')
const app = express();
const router = require('./routerAutho/RouterSignUp');
const car = require('./routerCar/routerCar');

const Port = 5500;

app.use(express.json())




app.use('/',router)
app.use('/car',car)


//Swagger
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(Port, ()=> console.log(`Port,BD works`))      
