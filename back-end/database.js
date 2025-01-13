const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',         // Ім'я користувача PostgreSQL
    host: 'localhost',             // Адреса сервера PostgreSQL (або IP-адреса)
    database: 'TopSpots_db',     // Назва бази даних
    password: 'Fanta0013!',     // Пароль користувача PostgreSQL
    port: 5432, 
})


async function checkDatabaseConnection() {
    pool.connect((err)=>{
        if(err)console.log(`Problem with Database connnection: ${err}`)
            else console.log(`Successful connection to Database`)
    })
}
checkDatabaseConnection();
module.exports = pool