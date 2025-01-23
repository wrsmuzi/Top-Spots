const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Отримуємо рядок з .env
     ssl: {
        rejectUnauthorized: false
    }
});


async function checkDatabaseConnection() {
    pool.connect((err)=>{
        if(err)console.log(`Problem with Database connnection: ${err}`)
            else console.log(`Successful connection to Database`)
    })
}
checkDatabaseConnection();
module.exports = pool