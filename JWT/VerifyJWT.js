const jwt = require('jsonwebtoken');
const Secret_Key = require('./secretKeyJwt');


async function VerifyJWT(token) {
        try {
            const resultVerifyJWT = await jwt.verify(token,Secret_Key);
            return resultVerifyJWT;
        } catch (error) {
            throw new Error ('verefication was unsuccessful')
        }
}

module.exports ={
    "VerifyJWT":VerifyJWT
}