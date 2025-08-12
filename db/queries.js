const pool = require('./pool');
const bcrypt = require('bcryptjs');

async function getAllMessagesWithUsers(){
    const {rows} = await pool.query('SELECT u.firstName,u.lastName,m.message,m.createdAt FROM users u  JOIN messages m ON u.id = m.userId ORDER BY m.createdAt DESC');

    return rows;
}

async function addUser(data){
    const hashedPassword = await bcrypt.hash(data.password,10)
    await pool.query(`INSERT INTO users (firstName,lastName,userName,password)
                      VALUES ($1 ,$2 ,$3 ,$4) RETURNING *`,
                      [data.firstName,data.lastName,data.userName,hashedPassword]
                    );
}

async function getUser(userName){
    const {rows} = await pool.query('SELECT * FROM users WHERE userName = $1',[userName]);
    return rows[0];
}

module.exports = {addUser,getUser,getAllMessagesWithUsers};