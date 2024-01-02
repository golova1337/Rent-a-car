const {VerifyJWT} = require('./VerifyJWT');



const checkJWT = async(req,res,next)=>{
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'Отсутствует токен доступа' });
        }
        const result = await VerifyJWT(token);
        req.payload = result
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).json({message: error.message}).end()
    }
    
}
const checkJWTSuperadmin = async(req,res,next)=>{
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'Отсутствует токен доступа' });
        }
        const result = await VerifyJWT(token);
        if (result.role !== 'superadmin') {
            return res.status(401).json({ message: 'ты не суперадмин' }).end();
        }
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).json({message: error.message}).end()
    }
    
}
const checkJWTadmin = async(req,res,next)=>{
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'Отсутствует токен доступа' });
        }
        const result = await VerifyJWT(token);
        if (result.role !== 'admin') {
            return res.status(401).json({ message: 'ты не админ' }).end();
        }
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).json({message: error.message}).end()
    }
    
}

module.exports ={
    "checkJWT" : checkJWT,
    "checkJWTSuperadmin":checkJWTSuperadmin,
    "checkJWTadmin":checkJWTadmin
}