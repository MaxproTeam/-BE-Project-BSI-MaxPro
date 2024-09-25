import db from '../config/database.js';

const getUserSessions = async () => {
    const [sessions] = await db.query('SELECT * FROM user_sessions')
    return sessions;
}

const getUserSessionById = async (params) => {
    const [session] = await db.query(`SELECT * FROM user_sessions WHERE id = ?`, [params]);
    return session;
}

const checkCredentials = async (params) => {
    const [session] = await db.query(`SELECT * FROM user_sessions WHERE token = ?`, [params]);
    return session;
}

const createUserSession = async (data) => {
    await db.query('INSERT INTO user_sessions (id, userid, token, expired_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
        data.id, data.userid, data.token, data.expiredAt, data.createdAt, data.updatedAt
    ]);

    const [session] = await db.query('SELECT * FROM user_sessions WHERE userid = ?', [data.userid]);
    return session[0];
}

export {getUserSessions, getUserSessionById, checkCredentials, createUserSession};