const {Auto} = require('../ClassAuto/СreateAuto')
const {InsertNewAutoBD} = require('../BD/InsertNewAutoBD');
const {DeleteAutoBD} = require('../BD/DeleteAutoBD');
const {FilterCarsBD} = require('../BD/FilterCarsBD');
const {IncludeLettersBd} = require('../BD/IncludeLettersBd');
const {returnCarBd} = require('../BD/returnCarBd');
const {RentalCarsBD} = require('../BD/RentalCarsBD');
const {InsertNewRent} = require('../BD/Rent/InsertNewRent')
const {GetAllCarsBd} = require('../BD/GetAllCarsBd');
const {RentCar} = require('../BD/Rent/RentCar');
const {getAllUsersBd} = require('../BD/getAllUsresBd');



//создания авто с занесением его в таблицу cars доступно только админу 
const createAuto = async (req,res)=>{
    try {
        const {Brand,Model,Number,Year,Price} = req.body;
        const newAuto =  new Auto(Brand,Model,Number,Year,Price);
        const result = await InsertNewAutoBD(newAuto.brand,newAuto.model,newAuto.number,newAuto.year,newAuto.price);
        return res.status(201).json({message:'Car was created'}).end()
    } catch (error) {
            return res.status(500).json( error.message );
    }
}
//удаление авто с таблицы cars доступно только админу 
const DeleteAuot = async (req,res)=>{
    try {
        if (!req.body.Number) {
            return res.status(400).json({message:'enter the machine number'}).end();
        }
        const result = await DeleteAutoBD(req.body.Number);
        return res.status(200).json({ message: 'Car was deleted' }).end();

    } catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }

}
//Можливість бачити які автівки зараз доступні для прокату - користувач і адмін
const RentalCars = async (req,res)=>{
        const result = await RentalCarsBD();
        if (result.length === 0) {
            return res.status(200).json({message:'There are no machines in rental'})
        }
        return res.status(200).json({'auto':result})

}
//фільтрувати автівки що доступні по всім полям які є у автівки (наприклад brand, model, year etc)
const FilterCars = async(req,res)=>{
    try {
        const { brand, model, price, year } = req.query;
        if (!brand && !model && !price && !year) {
            throw new Error('введи какие то данные')
        }
        let query = 'SELECT * FROM cars WHERE 1 = 1'; // Начальный SQL-запрос
        const params = [];
        if (brand) {
            query += ' AND Brand = ?';
            params.push(brand);
          }
        if (model) {
            query += ' AND Model = ?';
            params.push(model);
          }
        if (price) {
            query += ' AND Price  = ?';
            params.push(price);
          }
        if (year) {
            query += ' AND Year  = ?';
            params.push(year);
          }
        query+= ' AND is_deleted  = 0 AND in_renting  = 0'
        const result = await FilterCarsBD(query,params);
        if (!result.length === 0) {
            return res.status(404).json({message:'нет таких авто'})
        }
        return res.status(200).json({auto:result})

    } catch (error) {
        return res.status(400).json(error.message)
    }

}
//Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
const GetAllCars = async(req,res)=>{
    try {
        const result =  await GetAllCarsBd();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json(error.message)
    }

}
// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
const includeLetters = async(req,res)=>{
    try {
        let queryInclude = "SELECT * FROM cars WHERE 1 = 1 ";
        let params = [];
        if (req.query.brand) {
            queryInclude+="AND  brand LIKE ? ";
            params.push(`%${req.query.brand}%`)
        }
        if (req.query.model) {
            queryInclude+="OR  model LIKE ? ";
            params.push(`%${req.query.model}%`);
        }
        queryInclude+= ' AND is_deleted  = 0 AND in_renting  = 0'
        const result = await IncludeLettersBd(queryInclude,params)
        return res.status(200).json({auto:result})
    } catch (error) {
        return res.status(400).json(error.message)
    }
}
//аренда машин 
const rent = async(req,res)=>{
    const {startTime,endTime,number} = req.body;
    const {email} = req.payload
    try {
        if (!startTime || !endTime || !number) {
            return res.status(400).json('enter the data')
        }
        const resultRentCar = await RentCar(number,email);
        
        const data = [];
        data.push(email,number,startTime,endTime);

        const resultInsertRent = await InsertNewRent(data);
        return res.status(200).json("you rented").end()
    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }


}
//возврат авто с аренды только админ может делать
const returnCar = async(req,res)=>{
    try {
     if (!req.body.number || !req.body.endTime) {
         return res.status(400).json("enter the data")
     }
         const result = await returnCarBd(req.body.number,req.body.endTime);
         return res.status(200).json('car has returned');
    } catch (error) {
         return res.status(400).json({message:error.message})
    }
}

module.exports = {
    "createAuto":createAuto,
    "DeleteAuot":DeleteAuot,
    "RentalCars":RentalCars,
    "FilterCars":FilterCars,
    "includeLetters":includeLetters,
    "GetAllCars":GetAllCars,
    "returnCar":returnCar,
    "rent":rent
}