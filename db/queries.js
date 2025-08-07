const pool = require('./pool');

async function addUser(data){
    await pool.query(`INSERT INTO users (firstName,lastName,password,status)
                      VALUES ($1 ,$2 ,$3 ,$4) RETURNING *`,
                      [data.firstName,data.lastName,data.password,"guest"]
                    );
}

module.exports = {addUser};