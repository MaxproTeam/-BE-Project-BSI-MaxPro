import managerServices from "../services/MANAGERServices.js";
import { attedanceSchema } from "../validations/attedanceValidations.js";
import { companiesSchema } from "../validations/companiesValidations.js";
import { workOrderSchema } from "../validations/workOrderValidation.js";

const getCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 4 } = req.query;
        const offset = (page - 1) * limit;

        const { error } = companiesSchema.getCompanies.validate(req.query, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getCompanies({limit : parseInt(limit), offset : parseInt(offset)});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const countCompanies = await managerServices.getCountCompanies();
        if (countCompanies.errors) {
            return res.status(400).json({ 
                status_code: countCompanies.status_code,
                message: countCompanies.message,
                errors: countCompanies.errors
            });
        }

        const supervisor = await managerServices.getSPV();
        if (supervisor.errors) {
            return res.status(400).json({ 
                status_code: supervisor.status_code,
                message: supervisor.message,
                errors: supervisor.errors
            });
        }

        const pic = await managerServices.getCountPIC();
        if (pic.errors) {
            return res.status(400).json({ 
                status_code: pic.status_code,
                message: pic.message,
                errors: pic.errors
            });
        }
        
        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data companies.',
            data : {
                companies : result.companies,
                supervisor : supervisor.spv, 
                pic : pic, 
                pagination: {
                    totalItems: countCompanies.totalResults.total,
                    totalPages: Math.ceil(countCompanies.totalResults.total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit),
                },
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const getCompaniesById = async (req, res) => {
    try {
        const { error } = companiesSchema.getCompaniesById.validate(req.params, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getCompaniesById(req.params);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const supervisor = await managerServices.getSPV(req.params);
        if (supervisor.errors) {
            return res.status(400).json({ 
                status_code: supervisor.status_code,
                message: supervisor.message,
                errors: supervisor.errors
            });
        }

        const pic = await managerServices.getCountPIC(req.params);
        if (pic.errors) {
            return res.status(400).json({ 
                status_code: pic.status_code,
                message: pic.message,
                errors: pic.errors
            });
        }
        
        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data company.',
            data : {
                company : result.company,
                supervisor : supervisor.spv, 
                pic : pic
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const getPICAttedancesByCompany = async (req, res) => {
    try {
        const { errorCompanies } = companiesSchema.getCompaniesById.validate(req.params, { abortEarly: false })
        if (errorCompanies) {
            const errors = {};
            errorCompanies.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const { errorAttendances } = attedanceSchema.getPIC.validate(req.query, { abortEarly: false })
        if (errorAttendances) {
            const errors = {};
            errorAttendances.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getPICAttedancesByCompany(req.params, req.query);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data pic attendances in detail company.',
            data : {
                pic_attedances : result.picAttedances
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const getWorkOrdersByCompany = async (req, res) => {
    try {
        const { error } = companiesSchema.getCompaniesById.validate(req.params, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const { errorWorkOrder } = workOrderSchema.getWorkOrderByCompany.validate(req.query, { abortEarly: false })
        if (errorWorkOrder) {
            const errors = {};
            errorWorkOrder.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getWorkOrdersByCompany(req.params, req.query);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data work order in detail company.',
            data : {
                work_orders : result.work_orders
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const getWorkOrders = async (req, res) => {
    try {
        const { error } = workOrderSchema.getWorkOrders.validate(req.query, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getWorkOrders({ authorization: req.userAuthorization, body: req.query});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }
        
        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data work orders.',
            data : {
                work_orders : result.work_orders
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const getWorkOrderById = async (req, res) => {
    try {
        const { error } = workOrderSchema.getWorkOrderById.validate(req.params, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }

        const result = await managerServices.getWorkOrderById(req.params);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const supervisor = await managerServices.getSPV({id: result.work_order.company_id});
        if (supervisor.errors) {
            return res.status(400).json({ 
                status_code: supervisor.status_code,
                message: supervisor.message,
                errors: supervisor.errors
            });
        }

        const pic = await managerServices.getCountPIC({id: result.work_order.company_id});
        if (pic.errors) {
            return res.status(400).json({ 
                status_code: pic.status_code,
                message: pic.message,
                errors: pic.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data work order.',
            data : {
                work_order : result.work_order,
                supervisor : supervisor.spv, 
                pic : pic
            }
        })
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
}

const approveWorkOrder = async (req, res) => {
    try {
        const { error } = workOrderSchema.approveWorkOrder.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
        
            return res.status(400).json({
                status_code: 400,
                message: 'Bad Request',
                errors: errors
            });
        }
        
        const result = await managerServices.approveWorkOrder(req.body);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully approved the work order.'
        })

    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
    
}

export { getCompanies, getCompaniesById, getPICAttedancesByCompany, getWorkOrdersByCompany, getWorkOrders, getWorkOrderById, approveWorkOrder };