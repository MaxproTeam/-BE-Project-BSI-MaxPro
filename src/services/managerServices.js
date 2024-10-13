import htmlspecialchars from 'htmlspecialchars';
import { v4 as uuidv4 } from 'uuid';

import { getCountPICByCompanies, getSPVByCompanies, getCountPICByCompaniesId, getSPVByCompaniesId, getUserProfileById } from '../models/UserProfileModel.js';
import { getCompanies, getCompaniesById, getCountCompanies } from '../models/CompaniesModel.js';
import { getPICAttedancesByCompany } from '../models/AttedanceModel.js';
import { getWorkOrderById, getWorkOrders, getWorkOrdersByCompany, updatedStatusWorkOrder } from '../models/WorkOrderModel.js';

import { getWIBTime } from '../utils/time.js';

const managerServices = {
  getCompanies: async (params) => {
    try {
      const { limit, offset } = {
        limit : htmlspecialchars(params.limit),
        offset : htmlspecialchars(params.offset),
      };

      const companies = await getCompanies({limit: parseInt(limit), offset : parseInt(offset)});
    
      if (!companies) {
        return { status_code: 400, message: 'Bad Request', errors: 'Data not found.' };
      }
  
      return { companies };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getCompaniesById: async (data) => {
    try {
      const { id } = {
        id: htmlspecialchars(data.id)
      };

      const [company] = await getCompaniesById(id);
    
      if (!company) {
        return { status_code: 400, message: 'Bad Request', errors: 'Data not found.' };
      }
  
      return { company };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getCountCompanies :async (params) => {
    try {
      const [totalResults] = await getCountCompanies();

      if (!totalResults) {
        return { status_code: 400, message: 'Bad Request', errors: 'Total Companies not found.' };
      }

      return { totalResults };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getSPV: async (params) => {
    try {
      let spv;
      if(params) {
        [spv] = await getSPVByCompaniesId({id : parseInt(htmlspecialchars(params.id))});
      }else{
        spv = await getSPVByCompanies();
      }
  
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
  getPICAttedancesByCompany : async (params, query) => {
    try {
      const data = {};

      if(params && params.id){
        data.company = parseInt(htmlspecialchars(params.id));
      }

      if(params && query.day) {
        data.day = htmlspecialchars(query.day);
      }

      const picAttedances = await getPICAttedancesByCompany(data);
      
      if (!picAttedances) {
        return { status_code: 400, message: 'Bad Request', errors: 'PIC Attendances not found.' };
      }

      return { picAttedances };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  getWorkOrdersByCompany : async (params, query) => {
    try {
      const data = {};

      if(params && params.id){
        data.company = parseInt(htmlspecialchars(params.id));
      }

      if(params && query.day) {
        data.day = htmlspecialchars(query.day);
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
  getWorkOrders : async (params) => {
    try {
      const data = {};

      if (Object.keys(params).length > 0 && params.authorization) {
        data.authorization = params.authorization;
      }

      if(Object.keys(params).length > 0 && params.body.filter){
        data.filter = htmlspecialchars(params.body.filter)
      }

      if(Object.keys(params).length > 0 && params.body.filterDate) {
        data.date = htmlspecialchars(params.body.filterDate)
      }

      const [userProfile] = await getUserProfileById(data.authorization)

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      if(userProfile && userProfile.role) {
        data.role = userProfile.role;
      }

      if(userProfile && userProfile.id) {
        data.pic = userProfile.id;
      }

      if(Object.keys(params).length > 0 && params.body.limit) {
        data.limit = parseInt(htmlspecialchars(params.body.limit));
      } 
      
      const work_orders = await getWorkOrders(data);
      
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
  getWorkOrderById : async (params) => {
    try {
      const [work_order] = await getWorkOrderById({id : htmlspecialchars(params.id)});
      
      if (!work_order) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work order not found.' };
      }

      delete work_order.client
      delete work_order.pic
      delete work_order.created_at
      delete work_order.updated_at

      return { work_order };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
  approveWorkOrder: async (data) => {
    try {
      const { id, approve } = {
        id : htmlspecialchars(data.id),
        approve : htmlspecialchars(data.approve)
      }

      const [work_order] = await getWorkOrderById({id});

      if (!work_order) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work Order not found.' };
      }    

      const approvedWorkOrder = await updatedStatusWorkOrder({
        id, 
        status : approve === 'Approved' ? 3 : null,
        updatedAt: getWIBTime()});

      if(!approvedWorkOrder) {
        return { status_code: 400, message: 'Bad Request', errors: 'Approved failed.' };
      }    

      return {};

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },
};



export default managerServices;