const bcrypt = require('bcrypt');

async function HashingPassword(password) {
   try {
    const Hash = await bcrypt.hash(password,10);
    return Hash;
   } catch (error) {
    throw new Error('Hashing error: ' + error.message)
   }
}

module.exports = {
    "HashingPasswor" : HashingPassword
}

