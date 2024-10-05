import htmlspecialchars from 'htmlspecialchars';

import { getSPVByCompanies, getUserProfileById } from '../models/UserProfileModel.js';
import { getWorkOrders, createWorkOrder, countWorkOrder } from '../models/WorkOrderModel.js';

import { getHoursWIBTime, getWIBTime } from '../utils/time.js';
import { getPICAttedancesByCompany, getSPVAttedancesByCompany } from '../models/AttedanceModel.js';

const clientServices = {
  getPICAttedances: async (data) => {
    try {
      const { authorization } = data;
      
      const [user] = await getUserProfileById(authorization);

      if(!user) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      const pic = await getPICAttedancesByCompany({company: user.company});
      
      if (!pic) {
        return { status_code: 400, message: 'Bad Request', errors: 'PIC attendances not found.' };
      }

      return { pic };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getSPVAttedances: async (data) => {
    try {
      const { authorization } = data;
      
      const [user] = await getUserProfileById(authorization);

      if(!user) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      const spv = await getSPVAttedancesByCompany({company: user.company});
      
      if (!spv) {
        return { status_code: 400, message: 'Bad Request', errors: 'SPV attendances not found.' };
      }

      return { spv };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  setWorkOrder: async (data) => {
    try {
      const { authorization, workOrder, description, start_work, end_work, notes } = {
        authorization : data.authorization,
        workOrder : htmlspecialchars(data.body.workOrder),
        description : htmlspecialchars(data.body.description),
        start_work : htmlspecialchars(data.body.start_work),
        end_work : htmlspecialchars(data.body.end_work),
        notes : htmlspecialchars(data.body.notes)
      }

      const [userProfile] = await getUserProfileById(authorization)

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }
      
      const [result] = await countWorkOrder();

      const dataWorkOrder = await createWorkOrder({
        id: 'WO-' + (result.totalResults + 1),
        company_id : userProfile.company,
        client: userProfile.id,
        pic: null,
        workOrder: workOrder, 
        description : description, 
        notes: notes,
        start_work : start_work + ' ' + getHoursWIBTime(), 
        end_work : end_work + ' ' + getHoursWIBTime(),
        createdAt: getWIBTime(),
        updatedAt: getWIBTime()
      });

      if(!dataWorkOrder) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work Order cannot be added' }
      }

      return { dataWorkOrder }

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      }
    }
  },
  getWorkOrders : async (params) => {
    try {
      let work_orders;
      if(Object.keys(params).length > 0) {
        work_orders = await getWorkOrders({limit : parseInt(htmlspecialchars(params.limit))});
      } else{
        work_orders = await getWorkOrders();
      }
      
      if (!work_orders) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work order not found.' };
      }

      if(Array.isArray(work_orders)) {
        work_orders.forEach(work_order => {
          delete work_order.client
          delete work_order.updated_at
        })
      }

      return { work_orders };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getWorkOrderSPVs : async (params) => {
    try {
      const spv = await getSPVByCompanies();
      
      if (!spv) {
        return { status_code: 400, message: 'Bad Request', errors: 'Supervisor not found.' };
      }
      
      return { spv };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
};

export default clientServices;