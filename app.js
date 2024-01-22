const express  = require('express');
const expressOasGenerator = require('express-oas-generator');
const app = express();
const router = require('./routerAutho/RouterSignUp');
const car = require('./routerCar/routerCar');

const Port = 5500;

app.use(express.json())



expressOasGenerator.init(app, {});


app.use('/',router)
app.use('/car',car)



app.listen(Port, ()=> console.log(`Port,BD works`))      