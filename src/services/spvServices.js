import htmlspecialchars from 'htmlspecialchars';
import { v4 as uuidv4 } from 'uuid';

import { getPICByCompanies, getUserProfileById } from '../models/UserProfileModel.js';
import { getUserAttedancesByUserId, getCountUserAttedancesByUserId, createUserAttedance, getPICAttedancesByCompany } from '../models/AttedanceModel.js';

import { getWIBTime } from '../utils/time.js';
import { getWorkOrderById, getWorkOrdersByCompany, updatedAssignedWorkOrder, updatedStatusWorkOrder } from '../models/WorkOrderModel.js';
import { createCheckWork } from '../models/CheckWorkModel.js';

const spvServices = {
  setAttedance: async (params) => {
    try {
      let { attedance, latitude, longitude, authorization } = {
        attedance: htmlspecialchars(params.body.attedance),
        latitude: htmlspecialchars(params.body.latitude),
        longitude: htmlspecialchars(params.body.longitude),
        authorization: htmlspecialchars(params.authorization)
      };

      const [userProfile] = await getUserProfileById(authorization);

      if (!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found.' };
      }

      if (attedance !== 'Hadir') {
        return { status_code: 400, message: 'Bad Request', errors: 'Invalid Attendance status.' };
      }      

      const userAttedance = await createUserAttedance({
        id: uuidv4(),
        userid: userProfile.id,
        company_id: userProfile.company_id,
        start_attedance: getWIBTime(),
        latitude: latitude,
        longitude: longitude,
        end_attedance: null,
        status: 1,
        createdAt: getWIBTime(),
        updatedAt: getWIBTime()
      });

      return { userAttedance };

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },

  getPICAttedances: async (params) => {
    try {
      const data = {};

      if(params && params.authorization) {
        data.authorization = params.authorization;
      }

      if(params && params.body.day){
        data.day = htmlspecialchars(params.body.day);
      } 

      const [userProfile] = await getUserProfileById(data.authorization);

      if(!userProfile) {
        return { status_code: 400, message: 'Bad Request', errors: 'User not found' }
      }

      if(userProfile.company_id) {
        data.company = userProfile.company_id;
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

  getAttedances: async (params) => {
    try {
      let { limit, offset, authorization } = {
        limit : htmlspecialchars(params.limit),
        offset : htmlspecialchars(params.offset),
        authorization: htmlspecialchars(params.authorization)
      };

      const userAttedances = await getUserAttedancesByUserId({limit: parseInt(limit), offset : parseInt(offset), authorization});
  
      if (!userAttedances) {
        return { status_code: 400, message: 'Bad Request', errors: 'Data not found.' };
      }
  
      if (Array.isArray(userAttedances)) {
        userAttedances.forEach(attendance => {
          delete attendance.latitude;
          delete attendance.longitude;
        });
      } else {
        delete userAttedances.latitude;
        delete userAttedances.longitude;
      }
  
      return { userAttedances };
    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      };
    }
  },

  getCountAttedances: async (params) => {
    try {
      const [totalResults] = await getCountUserAttedancesByUserId(params.authorization);
  
      if (!totalResults) {
        return { status_code: 400, message: 'Bad Request', errors: 'Total user attedances not found.' };
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
  
  getPIC: async () => {
    try {
      const pic = await getPICByCompanies();
      
      if (!pic) {
        return { status_code: 400, message: 'Bad Request', errors: 'PIC not found.' };
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

  getWorkOrders : async (params) => {
    try {
      const data = {};

      if (params && params.authorization) {
        data.authorization = params.authorization;
      }

      if (params && params.body.filter) {
        data.filter = htmlspecialchars(params.body.filter);
      }

      if (params && params.body.filterDate) {
        data.date = htmlspecialchars(params.body.filterDate);
      }

      if (params && params.body.status) {
        data.status = parseInt(htmlspecialchars(params.body.status));
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

      if(userProfile && userProfile.id) {
        data.pic = userProfile.id;
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

  getWorkOrderById : async (params) => {
    try {
      const [work_order] = await getWorkOrderById({id : htmlspecialchars(params.id)});
      
      if (!work_order) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work order not found.' };
      }

      delete work_order.client
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

  assignWorkOrder: async (data) => {
    try {
      let { id, pic, notes } = {
        id : htmlspecialchars(data.id),
        pic : htmlspecialchars(data.pic),
        notes : htmlspecialchars(data.notes)
      }

      const userpic = await getPICByCompanies();
      
      if (!userpic) {
        return { status_code: 400, message: 'Bad Request', errors: 'PIC not found.' };
      }

      userpic.forEach((value, index) => {
        if(index === parseInt(pic)) {
            pic = value.id
        }
      })

      const assigned = await updatedAssignedWorkOrder({ id, pic, notes, updatedAt: getWIBTime() });

      if(!assigned) {
        return { status_code: 400, message: 'Bad Request', errors: 'Assigned Work Order cannot failed' }
      }

      return { assigned }

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      }
    }
  },

  checkWorkChecklist: async (data) => {
    try {
      let { authorization, work_id, evaluations } = {
        authorization : data.authorization,
        work_id : htmlspecialchars(data.body.work_id),
        evaluations : data.body.evaluations,
      }

      const [userProfile] = await getUserProfileById(authorization);

      if(!userProfile) {
        return { status_code : 400, message: 'Bad Request', errors: 'User not found' }
      }

      const [workOrder] = await getWorkOrderById({id : work_id}); 

      if(!workOrder) {
        return { status_code : 400, message: 'Bad Request', errors: 'Work Order not found' }
      }

      const [check_work] = await createCheckWork({
        work_id,
        company_id: userProfile.company_id,
        assessor : userProfile.id,
        evaluations: JSON.stringify(evaluations),
        createdAt: getWIBTime(),
        updatedAt: getWIBTime()
      });

      if(!check_work) {
        return { status_code : 400, message: 'Bad Request', errors: 'Failed to assess work' }
      }

      const updateStatusWork = workOrder ? await updatedStatusWorkOrder({ 
        id: work_id,
        status : 5,
        updatedAt : getWIBTime()
      }) : await updatedStatusWorkChecklist();

      if(!updateStatusWork) {
        return { status_code : 400, message: 'Bad Request', errors: 'Failed to updated status work' }
      }

      return {}

    } catch (err) {
      return {
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      }
    }
  },
};

export default spvServices;