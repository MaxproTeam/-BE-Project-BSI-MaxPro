import decrypt from '../utils/decrypt.js';
import config from '../config/config.js';

import { getUserProfileById } from '../models/UserProfileModel.js';
import { checkCredentials} from '../models/UserSessionModel.js';

const middlewareServices = {
  auth: async (params) => {
    try {
      
      let {userAuthorization, credentials } = params;

      const key = Buffer.from(config.encrypt_key, 'hex');
      const iv = Buffer.from(config.encrypt_iv, 'hex');

      userAuthorization =  decrypt(userAuthorization, key, iv);
      credentials = decrypt(credentials, key, iv)

      const [userProfile] = await getUserProfileById(userAuthorization);

      if (!userProfile) return { status_code : 400, message : 'Bad Request', errors: "User not found" };

      const [userCredentials] = await checkCredentials(credentials);

      if (!userCredentials) return { status_code : 400, message : 'Bad Request', errors: "Credentials do not match those of the user" };

      return { userAuthorization, credentials };

    } catch (err) {
      return res.status(500).json({
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      });
    }
  },
};

export default middlewareServices;