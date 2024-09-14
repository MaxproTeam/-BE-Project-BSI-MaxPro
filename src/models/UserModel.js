import db from '../config/database.js';

const getUsers = async () => {
    const [users] = await db.query('SELECT * FROM tbl_user')
    return users;
}

const getUser = async (id) => {
    const [user] = await db.query(`SELECT * FROM tbl_user WHERE id = ?`, id)
    return user;
}

export {getUsers, getUser};