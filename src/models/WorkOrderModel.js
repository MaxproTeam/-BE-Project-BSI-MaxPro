import db from '../config/database.js';

const getWorkOrders = async (params) => {
    let query = `SELECT work_orders.*, companies.name as company_name, user_status.status, user_profiles.full_name as pic
        FROM work_orders 
        LEFT JOIN user_profiles ON work_orders.pic = user_profiles.id 
        INNER JOIN companies ON work_orders.company_id = companies.id 
        LEFT JOIN user_status ON work_orders.status = user_status.id
    `;

    const queryParams = [];

    if(params && params.filter){
        if(params.filter === 'belum-disetujui' || params.filter === 'dipending') {
            query += ` WHERE work_orders.status IS NULL `;
        }else if(params.filter === 'ditolak') {
            query += ` WHERE work_orders.status = 5 `;
        }
    }

    if(params && params.date) {
        const [start, end] = params.date.split('...');

        query += ` AND work_orders.start_work >= ? AND work_orders.end_work <= ? `;
        queryParams.push(start);
        queryParams.push(end);
    }

    query += `ORDER BY work_orders.created_at DESC`;

    if (params && params.limit) {
        query += ` LIMIT ? `;
        queryParams.push(parseInt(params.limit));
    }

    const [work_orders] = await db.query(query, queryParams);

    return work_orders;
};

const getWorkOrderById = async (params) => {
    const [work_order] = await db.query(`SELECT work_orders.*, companies.name as company_name, user_status.status, user_profiles.full_name as pic
        FROM work_orders 
        LEFT JOIN user_profiles ON work_orders.pic = user_profiles.id
        INNER JOIN companies ON work_orders.company_id=companies.id 
        LEFT JOIN user_status ON work_orders.status=user_status.id
        WHERE work_orders.id= ?
        ORDER BY work_orders.created_at DESC`, [params.id])
    return work_order;
}

const getWorkOrdersByCompany = async (params) => {
    let query = `SELECT work_orders.*, companies.name as company_name, user_status.status, user_profiles.full_name as pic
    FROM work_orders 
    LEFT JOIN user_profiles ON work_orders.pic = user_profiles.id 
    INNER JOIN companies ON work_orders.company_id=companies.id 
    LEFT JOIN user_status ON work_orders.status=user_status.id`

    const queryParams=[];

    if (params && params.company) {
        query += ` WHERE work_orders.company_id = ? `;
        queryParams.push(params.company);
    }

    if(params && params.day) {
        query += ` AND DATE(work_orders.created_at) = ? `
        queryParams.push(params.day)
    }

    if(params && params.filter) {
        if(params.filter === 'belum-diperiksa' || params.filter === 'belum-ditugaskan'){
            query += ` AND work_orders.status IS NULL `;
        }else if (params.filter === 'sudah-diperiksa' || params.filter === 'sudah-ditugaskan') {
            query += ` AND work_orders.status IS NOT NULL `;
        }
    }

    if(params && params.date) {
        const [start, end] = params.date.split('...');

        query += ` AND work_orders.start_work >= ? AND work_orders.end_work <= ? `;
        queryParams.push(start);
        queryParams.push(end);
    }

    if (params && params.status) {
        query += ` AND work_orders.status = ? `;
        queryParams.push(params.status);
    }

    if(params && params.role) {
        if(params.role === 'PIC Cleaning') {
            query += ` AND work_orders.pic= ? `;
            queryParams.push(params.pic);
        }
    }

    query += `ORDER BY work_orders.created_at DESC`;

    if(params && params.limit) {
        query += ` LIMIT ? `;
        queryParams.push(params.limit)
    }

    const [work_orders] = await db.query(query, queryParams)

    return work_orders;
}

const countWorkOrder = async () => {
    const [totalResults] = await db.query(`SELECT COUNT(*) as totalResults FROM work_orders`);
    return totalResults;
}

const createWorkOrder = async (data) => {
    await db.query('INSERT INTO work_orders (id, company_id, client, pic, name, description, notes, start_work, end_work, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.id, data.company_id, data.client, data.pic, data.workOrder, data.description, data.notes, data.start_work, data.end_work, data.createdAt, data.updatedAt
    ]);

    const [workOrder] = await db.query(`SELECT name, start_work, end_work, created_at FROM work_orders WHERE id= ?`, [data.id]);
    return workOrder[0];
}

const updatedStatusWorkOrder = async (data) => {
    const [workOrder] = await db.query('UPDATE work_orders SET status= ?, updated_at= ? WHERE id= ?', [data.status, data.updatedAt, data.id]);
    return workOrder;
}

const updatedAssignedWorkOrder = async (data) => {
    const [workOrder] = await db.query('UPDATE work_orders SET pic= ?, notes= ?, updated_at= ? WHERE id= ?', [data.pic, data.notes, data.updatedAt, data.id]);
    return workOrder;
}

export { getWorkOrders, getWorkOrderById, getWorkOrdersByCompany,  countWorkOrder, createWorkOrder, updatedStatusWorkOrder, updatedAssignedWorkOrder };