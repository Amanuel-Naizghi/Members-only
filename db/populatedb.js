require("dotenv").config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    // 1. Drop tables if they exist (in the right order: messages first, then users)
    await pool.query(`DROP TABLE IF EXISTS messages;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);

    // 2. Recreate tables
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        userName TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        title TEXT,
        createdAt TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Hash passwords
    const passAman = await bcrypt.hash("Aman123$", 10);
    const passMoss = await bcrypt.hash("Moss123$", 10);

    // 4. Insert default users
    const { rows: users } = await pool.query(
      `INSERT INTO users (firstName, lastName, userName, password)
       VALUES 
       ('Amanuel', 'Tesfatsion', $1, $2),
       ('Mussie', 'Tesfatsion', $3, $4)
       RETURNING id, userName`,
      ["Aman", passAman, "Moss", passMoss]
    );

    const amanId = users[0].id;
    const mossId = users[1].id;

    // 5. Insert default messages
    await pool.query(
      `INSERT INTO messages (userId, title, message)
       VALUES
       ($1, $2, $3),
       ($1, $4, $5),
       ($6, $7, $8),
       ($6, $9, $10)`,
      [
        amanId, 'Intro', 'Hello, this is Aman!',
        'Testing', 'Aman again, testing messages.',
        mossId, 'Greetings', 'Hi, I am Moss.',
        'My passion', 'I love building things.'
      ]
    );
    

    console.log("✅ Database seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seed();
