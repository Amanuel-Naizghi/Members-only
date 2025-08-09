const pool = require('./pool');
const bcrypt = require('bcryptjs')

async function addUser(data){
    const hashedPassword = await bcrypt.hash(data.password,10)
    await pool.query(`INSERT INTO users (firstName,lastName,userName,password,status)
                      VALUES ($1 ,$2 ,$3 ,$4, $5) RETURNING *`,
                      [data.firstName,data.lastName,data.userName,hashedPassword,"guest"]
                    );
}

async function getUser(userName){
    const {rows} = await pool.query('SELECT * FROM users WHERE userName = $1',[userName]);
    return rows[0];
}

module.exports = {addUser,getUser};