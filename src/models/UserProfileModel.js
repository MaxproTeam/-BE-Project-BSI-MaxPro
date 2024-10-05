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

const getSPVByCompaniesId = async (params) => {
    const [spv] = await db.query(`SELECT company, full_name FROM user_profiles WHERE role = 2 AND company = ?`, [params.id]);
    return spv;
};

const getCountPICByCompaniesId = async (params) => {
    const [count] = await db.query(`SELECT company, COUNT(id) AS picCount FROM user_profiles WHERE role = 1 AND company = ? GROUP BY company`, [params.id]);
    return count;
};

const getSPVByCompanies = async () => {
    const [spv] = await db.query(`SELECT company, full_name FROM user_profiles WHERE role = 2`);
    return spv;
}

const getCountPICByCompanies = async () => {
    const [count] = await db.query(`SELECT company, COUNT(id) as pic FROM user_profiles WHERE role = 1 GROUP BY company`);
    return count;
}

const createUserProfile = async (data) => {
    await db.query('INSERT INTO user_profiles (id, userid, full_name, agency_project, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.userprofilesid, data.userid, data.fullname, data.agency_project, data.role, data.createdAt, data.updatedAt
    ]);

    const [user] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [data.userprofilesid]);
    return user[0];
}

export {getUserProfiles, getUserProfileById, getUserProfileByUserId, getCountPICByCompanies, getSPVByCompanies, getCountPICByCompaniesId, getSPVByCompaniesId, createUserProfile};