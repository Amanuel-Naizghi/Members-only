const pool = require('./pool');
const bcrypt = require('bcryptjs');

async function getAllMessagesWithUsers(){
    const {rows} = await pool.query(`
    SELECT 
      u.userName,
      u.firstName,
      u.lastName,
      m.id,
      m.title,
      m.message,
      TO_CHAR(createdAt, 'FMMonth DD YYYY HH24:MI') AS formatted_date
    FROM messages m
    JOIN users u ON m.userId = u.id
  `);

    return rows;
}

async function addUser(data){
    const hashedPassword = await bcrypt.hash(data.password,10);
    await pool.query(`INSERT INTO users (firstName,lastName,userName,password)
                      VALUES ($1 ,$2 ,$3 ,$4) RETURNING *`,
                      [data.firstName,data.lastName,data.userName,hashedPassword]
                    );
}

async function getUser(userName){
    const {rows} = await pool.query('SELECT * FROM users WHERE userName = $1',[userName]);
    return rows[0];
}

async function addMessage(data,id){
  await pool.query(`INSERT INTO messages (userId, title, message)
                    VALUES ($1, $2, $3)`,
                    [id,data.title,data.message])
}

async function removeMessage(id){
  await pool.query(`DELETE FROM messages WHERE id = $1`,[id]);
}

module.exports = {addUser,getUser,getAllMessagesWithUsers,addMessage,removeMessage};