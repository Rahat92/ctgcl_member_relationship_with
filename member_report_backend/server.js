const app = require('./index')
const pool = require('./utils/connectToDb')
const dotenv = require('dotenv');
dotenv.config()
app.listen(3001, () => {
    console.log('Server is running on port ,', 3001)
})