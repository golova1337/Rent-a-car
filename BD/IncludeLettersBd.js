const mysql = require('mysql2/promise');
const{Config_Test} = require('./config');

async function IncludeLettersBd(query,params) {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
        const [result] = await connectionTest.execute(query,params);
        if (result.length === 0) {
            return 'No hits'
        }
        const newArray = result.map(({Brand,Model,Price,Year})=>({Brand,Model,Price,Year}));
        return newArray;
    } catch (error) {
        throw new Error('something went wrong')
    }
}

module.exports = {
    "IncludeLettersBd":IncludeLettersBd
}