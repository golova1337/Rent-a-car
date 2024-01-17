const express  = require('express');
const app = express();
const router = require('./routerAutho/RouterSignUp');
const car = require('./routerCar/routerCar');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');  // Для загрузки спецификации из YAML

const Port = 5500;

app.use(express.json())


const openApiSpec = YAML.load('./ReadMe/OpenApi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use('/',router)
app.use('/car',car)




app.listen(Port, ()=> console.log(`Port,BD works`))      