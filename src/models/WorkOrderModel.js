import db from '../config/database.js';

const getWorkOrders = async (params) => {
    if(params){
        const [work_orders] = await db.query(`SELECT work_orders.*, companies.name as company_name, user_status.status, work_orders.status as work_order_status
            FROM work_orders 
            INNER JOIN companies ON work_orders.company_id=companies.id 
            INNER JOIN user_status ON work_orders.status=user_status.id
            ORDER BY work_orders.created_at DESC
            LIMIT ?`, [params.limit])
        return work_orders;
    }else{
        const [work_orders] = await db.query(`SELECT work_orders.*, companies.name as company_name, user_status.status, work_orders.status as work_order_status
            FROM work_orders 
            INNER JOIN companies ON work_orders.company_id=companies.id 
            INNER JOIN user_status ON work_orders.status=user_status.id
            ORDER BY work_orders.created_at DESC`)
        return work_orders;
    }
}

const getWorkOrderById = async (params) => {
    const [work_order] = await db.query(`SELECT work_orders.*, companies.name as company_name, user_status.status, work_orders.status as work_order_status
        FROM work_orders 
        INNER JOIN companies ON work_orders.company_id=companies.id 
        INNER JOIN user_status ON work_orders.status=user_status.id
        WHERE work_orders.id= ?
        ORDER BY work_orders.created_at DESC`, [params.id])
    return work_order;
}

const getWorkOrdersByCompany = async (params) => {
    const [work_orders] = await db.query(`SELECT id, name, start_work, end_work, created_at FROM work_orders WHERE company_id= ? 
        ORDER BY created_at DESC`, [params.company])
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

const updatedApprovedWorkOrder = async (data) => {
    const [workOrder] = await db.query('UPDATE work_orders SET status= ?, updated_at= ? WHERE id= ?', [data.approve, data.updatedAt, data.id]);
    return workOrder;
}

export { getWorkOrders, getWorkOrderById, getWorkOrdersByCompany,  countWorkOrder, createWorkOrder, updatedApprovedWorkOrder };