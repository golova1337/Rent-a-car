const bcrypt = require('bcrypt');


async function ComparePassword(myPlaintextPassword, hash) {
    try {
    const result = await bcrypt.compare(myPlaintextPassword, hash);
    return result
    } catch (error) {
        return error
    }
}

module.exports = {
    "ComparePassword" : ComparePassword
}

