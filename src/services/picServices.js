import htmlspecialchars from 'htmlspecialchars';
import { v4 as uuidv4 } from 'uuid';

import { getSPVByCompanies, getUserProfileById } from '../models/UserProfileModel.js';
import { getUserAttedancesByUserId, getCountUserAttedancesByUserId, createUserAttedance } from '../models/AttedanceModel.js';

import { getWIBTime } from '../utils/time.js';
import { getWorkOrderById, getWorkOrdersByCompany, updatedStatusWorkOrder } from '../models/WorkOrderModel.js';

const picServices = {
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
        company_id : userProfile.company_id,
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

  getWorkOrders : async (params) => {
    try {
      const data = { status: 3 };

      if (params && params.authorization) {
        data.authorization = params.authorization;
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

  getSPV: async () => {
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

  doneWorkOrder: async (data) => {
    try {
      const { id, done } = {
        id : htmlspecialchars(data.id),
        done : htmlspecialchars(data.done)
      }

      const [work_order] = await getWorkOrderById({id});

      if (!work_order) {
        return { status_code: 400, message: 'Bad Request', errors: 'Work Order not found.' };
      }    

      const doneWorkOrder = await updatedStatusWorkOrder({
        id, 
        status : done ? 4 : null,
        updatedAt: getWIBTime()});

      if(!doneWorkOrder) {
        return { status_code: 400, message: 'Bad Request', errors: 'Failed completed the work order.' };
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

export default picServices;