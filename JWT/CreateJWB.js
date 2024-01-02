const jwt = require('jsonwebtoken');
const Secret_Key = require('./SecretKeyJwt')


async function CreateJWT(email,role) {
  try {
    const payload = {
        "email" :email,
        "role" :role,
    }
    const token = await jwt.sign(payload,Secret_Key,{ expiresIn: '1h' })
    return token
  } catch (error) {
    throw new Error('Failed to create JWT'); // Пример обработки ошибки
  }
}



module.exports ={
    "CreateJWT":CreateJWT
}


