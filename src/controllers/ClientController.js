import clientServices from '../services/clientServices.js';
import { attedanceSchema } from '../validations/attedanceValidations.js';
import { workOrderSchema } from '../validations/workOrderValidation.js';

const getPICAttedances = async (req, res) => {
  try {
      const authorization = req.userAuthorization;

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

      const result = await clientServices.getPICAttedances({authorization, body : req.query});
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

      const { error } = attedanceSchema.getSPV.validate(req.query, { abortEarly: false })
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

      const result = await clientServices.getSPVAttedances({authorization, body : req.query});
      if (result.errors) {
          return res.status(400).json({ 
              status_code: result.status_code,
              message: result.message,
              errors: result.errors
          });
      }

      return res.status(201).json({
          status_code : 201,
          message : 'Successfully fetch data spv attendances.',
          data : {
              attendances : result.spv
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

const setWorkOrder = async (req, res) => {
  try {
    const authorization = req.userAuthorization;
    const { error } = workOrderSchema.setWorkOrder.validate(req.body, { abortEarly: false });
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

    const result = await clientServices.setWorkOrder({authorization, body: req.body});
    if(result.errors) return res.status(400).json({ 
        status_code: result.status_code,
        message: result.message,
        errors : result.errors
    });

    res.status(201).json({ 
      status_code: 201,
      message: "Work order successfully added.",
      data: { 
        workOrder: result.dataWorkOrder
      }
    });

  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      message: 'Internal Server Error',
      errors: err.message
    });
  }
};

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

      const result = await clientServices.getWorkOrders({ authorization: req.userAuthorization, body: req.query});
      if (result.errors) {
          return res.status(400).json({ 
              status_code: result.status_code,
              message: result.message,
              errors: result.errors
          });
      }

      const supervisor = await clientServices.getWorkOrderSPVs();
      if (supervisor.errors) {
          return res.status(400).json({ 
              status_code: supervisor.status_code,
              message: supervisor.message,
              errors: supervisor.errors
          });
      }

        const pic = await clientServices.getCountPIC();
        if (pic.errors) {
            return res.status(400).json({ 
                status_code: pic.status_code,
                message: pic.message,
                errors: pic.errors
            });
        }
      
      return res.status(201).json({
          status_code : 201,
          message : 'Successfully fetch data work orders.',
          data : {
              work_orders : result.work_orders,
              pic: pic,
              supervisor: supervisor.spv
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

export { getPICAttedances, getSPVAttedances, setWorkOrder, getWorkOrders };