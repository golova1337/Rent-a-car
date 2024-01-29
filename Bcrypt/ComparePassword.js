const bcrypt = require('bcrypt');


async function ComparePassword(myPlaintextPassword, hash) {
    return  await bcrypt.compare(myPlaintextPassword, hash);
}
module.exports = {
    ComparePassword
}

