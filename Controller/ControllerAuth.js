const {CheckExistUserBDlogin} = require('../BD/Check/CheckExistUserBDlogin');
const {CheckExistUserBDsignUp} = require('../BD/Check/CheckExistUserBDsignUp')
const {InsertUser} = require('../BD/InsertNewUser')
const { Users, Admin, SuperAdmin } = require('../ClassUsers/SuperClass')
const {HashingPasswor} = require('../Bcrypt/HashingPassword')
const {ComparePassword} = require('../Bcrypt/ComparePassword');
const {CreateJWT} = require('../JWT/CreateJWB');
const {DeleteUserBD} = require('../BD/DeleteUserBd');
const {getAllUsersBd} = require('../BD/getAllUsresBd')

//регестрація юзера та занесення його в бд БЕЗ видачі JWT
const signUp = async (req,res)=>{
        try {
            const {name,lastName,email,password} = req.body;
            const resExist = await CheckExistUserBDsignUp(email);

            const newUser = new Users (name,lastName,email);
            const HashResult = await HashingPasswor(password);
            const insert = await InsertUser(newUser.name,newUser.lastName,newUser.email,HashResult,newUser.role);
            return res.status(201).json({you:'created'}).end()
        } catch (error) {
            return res.status(400).json(error)
        }
}

//вхід та видача JWT с  ролью юзера
const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const {emailUser,roleUser,passwordUser} = await CheckExistUserBDlogin(email);

        const resultComparePassword = await ComparePassword(password,passwordUser);
        if (!resultComparePassword) {
            return res.status(400).json('Password is wrong').end()
        }
        const token = await CreateJWT(emailUser,roleUser)
        return res.status(200).json({'You logged on into the  account':token}).end()
        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    };

}

// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
const createAdmin = async (req,res)=>{
    const {name,lastName,email,password} = req.body;
    try {
        const result = await CheckExistUserBDsignUp(email);
        const hash = await HashingPasswor(password);
        const NewAdmin = SuperAdmin.CreateAdmin(name,lastName,email,hash);
        const InsertAdmin = await InsertUser(name,lastName,email,hash,NewAdmin.role);
        return res.status(201).json({message:NewAdmin}).end()
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Видалення користувачів (Soft Delete) - адмін
const deletedUser = async (req,res)=>{
   try {
    if (!req.body.email) {
        throw new Error('Enter the data');
    }
    const result = await DeleteUserBD(req.body.email)
    return res.status(200).json({[req.body.email]:'was deleted'})
   } catch (error) {
    return res.status(400).json(error.message).end()
   }
}

// Можливість бачити всіх користувачів - адмін
const getAllUsers = async(req,res)=>{
    try {
        const result = await getAllUsersBd();
        return res.status(200).json(result).end()
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    "signUp" : signUp,
    "login":login,
    "createAdmin":createAdmin,
    "deletedUser":deletedUser,
    "getAllUsers":getAllUsers
}