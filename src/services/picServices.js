import htmlspecialchars from 'htmlspecialchars';
import { v4 as uuidv4 } from 'uuid';
import gpsd from 'node-gpsd';

import { getUserProfileById } from '../models/UserProfileModel.js';
import { getUserAttedances, getCountUserAttedances, createUserAttedance } from '../models/AttedanceModel.js';

import getWIBTime from '../utils/time.js';

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
      const userAttedances = await getUserAttedances(params);
  
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
      const [totalResults] = await getCountUserAttedances();
  
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
  }
};

export default picServices;