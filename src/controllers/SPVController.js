import spvServices from "../services/spvServices.js";
import { attedanceSchema } from "../validations/attedanceValidations.js";
import { workChecklistSchema } from "../validations/workChecklistValidations.js";
import { workOrderSchema } from "../validations/workOrderValidation.js";

const setSPVAttedance = async (req, res) => {
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

        const result = await spvServices.setAttedance(data);
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
        const { error } = attedanceSchema.getPIC.validate(req.query, { abortEarly: false })
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
  
        const result = await spvServices.getPICAttedances({authorization : req.userAuthorization, body : req.query});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }
  
        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data pic attendances.',
            data : {
                attendances : result.pic
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

const getSPVAttedances = async (req, res) => {
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

        const result = await spvServices.getAttedances({limit : parseInt(limit), offset, authorization});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        const result2 = await spvServices.getCountAttedances({authorization});
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
  
        const result = await spvServices.getWorkOrders({ authorization: req.userAuthorization, body: req.query});
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

        const result = await spvServices.getWorkOrderById(req.params);
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data work order.',
            data : {
                work_order : result.work_order
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

const getPIC = async (req, res) => {
    try {
        const result = await spvServices.getPIC();
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully fetch data user pic.',
            data : {
                pic : result.pic
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

const assignWorkOrder = async (req, res) => {
    try {
      const { error } = workOrderSchema.assignWorkOrder.validate(req.body, { abortEarly: false });
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
  
      const result = await spvServices.assignWorkOrder(req.body);
      if(result.errors) return res.status(400).json({ 
          status_code: result.status_code,
          message: result.message,
          errors : result.errors
      });
  
      res.status(201).json({ 
        status_code: 201,
        message: "Work order successfully be assigned."
      });
  
    } catch (err) {
      return res.status(500).json({
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      });
    }
};

const checkWorkChecklist = async (req, res) => {
    try {
        const { error } = workChecklistSchema.checkWorkChecklist.validate(req.body, { abortEarly: false })
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
        
        const result = await spvServices.checkWorkChecklist({authorization : req.userAuthorization , body : req.body});
        if (result.errors) {
            return res.status(400).json({ 
                status_code: result.status_code,
                message: result.message,
                errors: result.errors
            });
        }

        return res.status(201).json({
            status_code : 201,
            message : 'Successfully evaluate the work checklist.'
        })

    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
    
};

export {setSPVAttedance, getPICAttedances, getSPVAttedances, getWorkOrders, getWorkOrderById, getPIC, assignWorkOrder, checkWorkChecklist};