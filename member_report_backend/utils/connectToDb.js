const mssql = require('mssql')
const dotenv = require('dotenv');

dotenv.config()

const config = {
    driver:"msnodesqlv8",
    server:process.env.DATABASE_IP,
    database:"DePos_ERP_UCL",
    user:"sa",
    password:"@dm1n321#",
    options:{
        encrypt:false,
        enableArithAbort:false
    }
}

const pool = new mssql.ConnectionPool(config);
pool.on('error', err =>{
    console.error(err)
})


async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Connected to SQL Server database.', process.env.DATABASE_IP);
    } catch (error) {
        console.error('Failed to connect to SQL Server database:', error);
        process.exit(1); // Exit the application with an error code
    }
}

connectToDatabase();
module.exports = pool;