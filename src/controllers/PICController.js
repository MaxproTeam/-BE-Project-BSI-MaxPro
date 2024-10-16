import picServices from "../services/picServices.js";
import { attedanceSchema } from "../validations/attedanceValidations.js";
import { workOrderSchema } from "../validations/workOrderValidation.js";

const setPICAttedance = async (req, res) => {
    try {
        const { error } = attedanceSchema.setAttendance.validate(req.body, { abortEarly: false })
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
        
        const data = {
            authorization : req.userAuthorization, 
            body : req.body
        };

        const result = await picServices.setAttedance(data);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully filled attendance.',
            data : {
                attendance : {
                    start_attedance : result.userAttedance.start_attedance,
                    end_attedance : result.userAttedance.end_attedance,
                    status: result.userAttedance.status
                }
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

const getPICAttedances = async (req, res) => {
    try {
        const authorization = req.userAuthorization;
        const { page = 1, limit = 7 } = req.query;
        const offset = (page - 1) * limit;

        const { error } = attedanceSchema.getAttedance.validate(req.query, { abortEarly: false })
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

        const result = await picServices.getAttedances({limit : parseInt(limit), offset, authorization});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const result2 = await picServices.getCountAttedances({authorization});
        if (result2.errors) {
            return res.status(400).json({ 
                status_code: resul2.status_code,
                message: result2.message,
                errors: result2.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data user attendances.',
            data : {
                attendances : result.userAttedances,
                pagination: {
                    totalItems: result2.totalResults.total,
                    totalPages: Math.ceil(result2.totalResults.total / limit),
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
  
        const result = await picServices.getWorkOrders({ authorization: req.userAuthorization, body: req.query});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const supervisor = await picServices.getSPV();
        if (supervisor.errors) {
            return res.status(400).json({ 
                status_code: supervisor.status_code,
                message: supervisor.message,
                errors: supervisor.errors
            });
        }
  
       return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data work orders.',
            data : {
                work_orders : result.work_orders,
                supervisor : supervisor.spv
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

const doneWorkOrder = async (req, res) => {
    try {
        const { error } = workOrderSchema.doneWorkOrder.validate(req.body, { abortEarly: false })
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
        
        const result = await picServices.doneWorkOrder(req.body);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully completed the work order.'
        })

    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
    
}

export { setPICAttedance, getPICAttedances, getWorkOrders, doneWorkOrder };