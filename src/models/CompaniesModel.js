import db from "../config/database.js";

const getCompanies = async (data) => {
    const [companies] = await db.query(`SELECT * FROM companies ORDER BY created_at DESC LIMIT ? OFFSET ?`, [data.limit, data.offset]);

    return companies;
}

const getCompaniesById = async (params) => {
    const [company] = await db.query(`SELECT * FROM companies WHERE id= ? ORDER BY created_at DESC`, [params]);

    return company;
}

const getCountCompanies = async () => {
    const [count] = await db.query(`SELECT COUNT(*) as total FROM companies`);

    return count;
}

export { getCompanies, getCompaniesById, getCountCompanies }