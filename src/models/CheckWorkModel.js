import db from "../config/database.js";

const createCheckWork = async (data) => {
    await db.query(`INSERT INTO check_works (work_id, company_id, assessor, evaluations, created_at, updated_at) VALUES (?,?,?,?,?,?)`, [
        data.work_id, data.company_id, data.assessor, data.evaluations, data.createdAt, data.updatedAt
    ]);

    const [checkWork] = await db.query(`SELECT * FROM check_works WHERE work_id= ? `, [data.work_id]);

    return checkWork;
}

export {createCheckWork}