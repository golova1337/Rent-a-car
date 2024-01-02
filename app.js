const express  = require('express');
const app = express();
const router = require('./routerAutho/RouterSignUp');
const car = require('./routerCar/routerCar');
const Port = 5500;

app.use(express.json())
// app.use(express.urlencoded({extended:true}))


app.use('/',router)
app.use('/car',car)




app.listen(Port, ()=> console.log(`Port,BD works`))      