import htmlspecialchars from 'htmlspecialchars';

import { getCountPICByCompanies, getCountPICByCompaniesId, getSPVByCompanies, getUserProfileById } from '../models/UserProfileModel.js';
import { createWorkOrder, countWorkOrder, getWorkOrdersByCompany } from '../models/WorkOrderModel.js';

import { getHoursWIBTime, getWIBTime } from '../utils/time.js';
import { getPICAttedancesByCompany, getSPVAttedancesByCompany } from '../models/AttedanceModel.js';

const clientServices = {
  getPICAttedances: async (params) => {
    try {
      const data = {};

      if(params && params.authorization) {
        data.authorization = params.authorization;
      }
      
      const [userProfile] = await getUserProfileById(data.authorization);

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      if(params && userProfile.company_id){
        data.company = userProfile.company_id
      }

      if(params && params.body.day) {
        data.day = htmlspecialchars(params.body.day)
      }

      const pic = await getPICAttedancesByCompany(data);
      
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
  getSPVAttedances: async (params) => {
    try {
      const data = {};

      if(params && params.authorization) {
        data.authorization = params.authorization;
      }
      
      const [userProfile] = await getUserProfileById(data.authorization);

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      if(params && userProfile.company_id){
        data.company = userProfile.company_id
      }

      if(params && params.body.day) {
        data.day = htmlspecialchars(params.body.day)
      }

      const spv = await getSPVAttedancesByCompany(data);
      
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
        company_id : userProfile.company_id,
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
      const data = {};

      if (params && params.authorization) {
        data.authorization = params.authorization;
      }

      if(params && params.body.filterDay){
        data.day= htmlspecialchars(params.body.filterDay);
      }

      if(params && params.body.filter){
        data.filter= htmlspecialchars(params.body.filter);
      }

      if(params && params.body.filterDate){
        data.date= htmlspecialchars(params.body.filterDate);
      }

      if(params && params.body.status){
        data.status= parseInt(htmlspecialchars(params.body.status));
      }
      
      if (params && params.body.limit) {
        data.limit = parseInt(htmlspecialchars(params.body.limit));
      }

      const [userProfile] = await getUserProfileById(data.authorization)

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      if(userProfile && userProfile.role) {
        data.role = userProfile.role;
      }

      if(userProfile && userProfile.company_id) {
        data.company = userProfile.company_id;
      }

      const work_orders = await getWorkOrdersByCompany(data);
      
      if (!work_orders) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work orders not found.' };
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
  getCountPIC: async (params) => {
    try {
      let total;
      if(params) {
        [total] = await getCountPICByCompaniesId({id : parseInt(htmlspecialchars(params.id))});
      }else{
        total = await getCountPICByCompanies();
      }
  
      if (!total) {
        return { status_code: 400, message: 'Bad Request', errors: 'TotaL PIC not found.' };
      }

      return { total };

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