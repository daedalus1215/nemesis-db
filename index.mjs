import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the database or create it if it doesn't exist
async function initializeDatabase() {
  // Open a database file or create one if it doesn't exist
  const db = await open({
    filename: './nemesis.db',
    driver: sqlite3.Database
  });

  try {
    // Create Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        balance REAL NOT NULL DEFAULT 0
      )
    `);

    // Create Transactions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Transactions (
        transaction_id INTEGER PRIMARY KEY,
        sender_id INTEGER,
        receiver_id INTEGER,
        amount REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES Users(user_id),
        FOREIGN KEY (receiver_id) REFERENCES Users(user_id),
        CHECK (sender_id != receiver_id)
      )
    `);

    console.log('Database and tables created successfully.');

  } catch (err) {
    console.error('Error creating database or tables:', err);
  } finally {
    await db.close();  // Ensure to close the database connection
  }
}

// Call the function to initialize the database
initializeDatabase().catch(console.error);