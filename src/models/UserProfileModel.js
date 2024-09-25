import db from '../config/database.js';

const getUserProfiles = async () => {
    const [users] = await db.query('SELECT * FROM user_profiles')
    return users;
}

const getUserProfileById = async (params) => {
    const [user] = await db.query(`SELECT * FROM user_profiles WHERE id = ?`, [params]);
    return user;
}

const getUserProfileByUserId = async (params) => {
    const [user] = await db.query(`SELECT * FROM user_profiles WHERE userid = ?`, [params]);
    return user;
}

const createUserProfile = async (data) => {
    await db.query('INSERT INTO user_profiles (id, userid, full_name, agency_project, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.userprofilesid, data.userid, data.fullname, data.agency_project, data.role, data.createdAt, data.updatedAt
    ]);

    const [user] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [data.userprofilesid]);
    return user[0];
}

export {getUserProfiles, getUserProfileById, getUserProfileByUserId, createUserProfile};