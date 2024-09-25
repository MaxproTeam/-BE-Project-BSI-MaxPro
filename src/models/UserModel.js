import db from '../config/database.js';

const getUsers = async () => {
    const [users] = await db.query('SELECT * FROM users')
    return users;
}

const getUserById = async (params) => {
    const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [params]);
    return user;
}

const getUserByUsername = async (params) => {
    const [user] = await db.query(`SELECT * FROM users WHERE username = ?`, [params]);
    return user;
}

const createUser = async (data) => {
    await db.query('INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
        data.userid, data.username, data.email, data.hashedPassword,  data.createdAt, data.updatedAt
    ]);

    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [data.userid]);
    return user[0];
}

export {getUsers, getUserById, getUserByUsername, createUser};