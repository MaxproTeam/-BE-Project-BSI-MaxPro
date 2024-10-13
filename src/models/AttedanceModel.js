import db from '../config/database.js';

const getUserAttedances = async () => {
    const [userAttedances] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id`)
    return userAttedances;
}

const getUserAttedanceById = async (params) => {
    const [userAttedance] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id 
        WHERE user_attedances.id = ?`, [params]);
    return userAttedance;
}

const getUserAttedancesByUserId = async (data) => {
    let query = `
        SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status = user_status.id
        WHERE user_attedances.userid = ?
    `;
    
    const queryParams = [data.authorization];

    if (data.limit) {
        query += ` LIMIT ? `;
        queryParams.push(parseInt(data.limit, 10));
    }

    if (data.offset) {
        query += ` OFFSET ? `;
        queryParams.push(parseInt(data.offset, 10));
    }

    const [userAttedances] = await db.query(query, queryParams);

    return userAttedances;
}

const getCountUserAttedancesByUserId = async (params) => {
    const [totalUserAttedance] = await db.query(`SELECT COUNT(*) as total FROM user_attedances WHERE userid= ?`, [params]);
    return totalUserAttedance;
}

const getPICAttedancesByCompany = async (params) => {
    let query = `SELECT user_attedances.id, user_attedances.start_attedance, user_attedances.end_attedance, user_profiles.full_name, user_status.status
        FROM user_attedances
        INNER JOIN user_profiles ON user_attedances.userid=user_profiles.id
        INNER JOIN user_status ON user_attedances.status=user_status.id
        WHERE user_profiles.role= 1`;

    const queryParams = [];

    if(params && params.company) {
        query += ` AND user_attedances.company_id = ? `;
        queryParams.push(params.company);
    }

    if(params && params.day) {
        query += ` AND DATE(user_attedances.created_at) = ? `;
        queryParams.push(params.day)
    }

    query += `ORDER BY user_attedances.created_at DESC`

    const [picAttedances] = await db.query(query, queryParams)

    return picAttedances;
}

const getSPVAttedancesByCompany = async (params) => {
    let query = `SELECT user_attedances.id, user_attedances.start_attedance, user_attedances.end_attedance, user_profiles.full_name, user_status.status
        FROM user_attedances
        INNER JOIN user_profiles ON user_attedances.userid=user_profiles.id
        INNER JOIN user_status ON user_attedances.status=user_status.id
        WHERE user_profiles.role= 2`;

    const queryParams = [];

    if(params && params.company) {
        query += ` AND user_attedances.company_id = ? `;
        queryParams.push(params.company);
    }

    if(params && params.day) {
        query += ` AND DATE(user_attedances.created_at) = ? `;
        queryParams.push(params.day)
    }

    query += `ORDER BY user_attedances.created_at DESC`

    const [spvAttedances] = await db.query(query, queryParams)

    return spvAttedances;
}

const createUserAttedance = async (data) => {
    await db.query('INSERT INTO user_attedances (id, userid, company_id, start_attedance, latitude, longitude, end_attedance, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.id, data.userid, data.company_id, data.start_attedance, data.latitude, data.longitude, data.end_attedance, data.status, data.createdAt, data.updatedAt
    ]);

    const [userAttedance] = await db.query(`SELECT user_attedances.*, user_status.status, user_attedances.status as attedance_status 
        FROM user_attedances 
        INNER JOIN user_status ON user_attedances.status=user_status.id 
        WHERE user_attedances.userid = ?`, [data.userid]);
    return userAttedance[0];
}

export { getUserAttedances, getUserAttedanceById, getUserAttedancesByUserId, getCountUserAttedancesByUserId, getPICAttedancesByCompany, getSPVAttedancesByCompany, createUserAttedance };