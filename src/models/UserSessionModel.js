import db from '../config/database.js';

const getUserSessions = async () => {
    const [users] = await db.query('SELECT * FROM user_sessions')
    return users;
}

const getUserSessionById = async (params) => {
    const [user] = await db.query(`SELECT * FROM user_sessions WHERE id = ?`, [params]);
    return user;
}

const createUserSession = async (data) => {
    await db.query('INSERT INTO user_sessions (id, userid, token, expired_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
        data.id, data.userid, data.token, data.expiredAt, data.createdAt, data.updatedAt
    ]);

    const [session] = await db.query('SELECT * FROM user_sessions WHERE userid = ?', [data.userid]);
    return session[0];
}

export {getUserSessions, getUserSessionById, createUserSession};