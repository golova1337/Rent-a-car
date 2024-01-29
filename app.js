require('dotenv').config()
const {knex} = require('./bd/createConnection');


const express  = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const options = require('./api/apiDoc')
const app = express();
const router = require('./routerAutho/routerSignUp');
const car = require('./routerCar/routerCar');


const Port = 5500;

app.use(express.json())

app.use((req, res, next) => {
    req.db = knex;
    next();
  });



app.use('/',router)
app.use('/car',car)

process.on('SIGINT', async ()=>{
    try {
     await knex.destroy();
     console.log('Connection is closed');
     process.exit(0);
    } catch (error) {
     console.error(`Error closing the connection: ${errorqqq}`);
     process.exit(1);
    }
})

//Swagger
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(Port, async ()=> {
    
    console.log(`Port,BD works`);
})      
