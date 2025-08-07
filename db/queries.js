const pool = require('./pool');
const bcrypt = require('bcryptjs')

async function addUser(data){
    const hashedPassword = await bcrypt.hash(data.password,10)
    await pool.query(`INSERT INTO users (firstName,lastName,password,status)
                      VALUES ($1 ,$2 ,$3 ,$4) RETURNING *`,
                      [data.firstName,data.lastName,hashedPassword,"guest"]
                    );
}

module.exports = {addUser};