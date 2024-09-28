import db from '../config/database.js';

const getUserAttedances = async (data) => {
    if(data) {
        const [userAttedances] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
            FROM user_attedances 
            INNER JOIN user_status ON user_attedances.status=user_status.id
            LIMIT ? OFFSET ?`, [data.limit, data.offset])
        return userAttedances;
    }else {
        const [userAttedances] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
            FROM user_attedances 
            INNER JOIN user_status ON user_attedances.status=user_status.id`)
        return userAttedances;
    }
}

const getUserAttedanceById = async (params) => {
    const [userAttedance] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id 
        WHERE user_attedances.id = ?`, [params]);
    return userAttedance;
}

const getUserAttedancesByUserId = async (params) => {
    const [userAttedance] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status 
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id 
        WHERE user_attedances.userid = ?`, [params]);
    return userAttedance;
}

const getCountUserAttedances = async () => {
    const [totalUserAttedance] = await db.query(`SELECT COUNT(*) as total FROM user_attedances`);
    return totalUserAttedance;
}

const createUserAttedance = async (data) => {
    await db.query('INSERT INTO user_attedances (id, userid, start_attedance, latitude, longitude, end_attedance, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.id, data.userid, data.start_attedance, data.latitude, data.longitude, data.end_attedance, data.status, data.createdAt, data.updatedAt
    ]);

    const [userAttedance] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status 
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id 
        WHERE user_attedances.userid = ?`, [data.userid]);
    return userAttedance[0];
}

export { getUserAttedances, getUserAttedanceById, getUserAttedancesByUserId, getCountUserAttedances, createUserAttedance };