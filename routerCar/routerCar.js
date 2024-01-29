const express = require('express');
const car  =  express.Router(); //имя роутера
const {checkJWTadmin,checkJWT} = require('../jwt/checkJWT'); // проверка что jwt админа или просто то что jwt верный
const {ValidtoBody} = require('../Middleware/validatorBodyCreateAuto'); //проверка данных боди для создания авто 
const {createAuto,DeleteAuot,FilterCars,includeLetters,GetAllCars,RentalCars,returnCar,rent,getAllUsers} = require('../controller/controllerAuto');//контролерры 


//Створення автівок - тільки адміном
car.post('/CreateAuto',ValidtoBody.CreateAuto,ValidtoBody.ValidationResult,checkJWTadmin,createAuto);
//видалення автівок - тільки адміном
car.delete('/DeleteAuto',checkJWTadmin,DeleteAuot);
 //Можливість бачити які автівки зараз в прокаті - адмін. 
car.get('/RentalCars',checkJWTadmin,RentalCars);
//можливість фільтрувати автівки що доступні  brand filter price админом и пользователем
car.get('/FilterCars',checkJWT,FilterCars);
// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
car.get('/includeLetters',checkJWT,includeLetters)
//Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
car.get('/getAllCars',checkJWT,GetAllCars);
//вповернення авто тільки адміном 
car.put('/return',checkJWTadmin,returnCar);
// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
car.post('/rent',checkJWT,rent);

















module.exports = car;