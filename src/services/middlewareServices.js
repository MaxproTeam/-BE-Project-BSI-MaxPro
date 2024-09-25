import { getUserProfileById } from '../models/UserProfileModel.js';
import { checkCredentials} from '../models/UserSessionModel.js';

const middlewareServices = {
  auth: async (params) => {
    try {
      let {userAuthorization, credentials } = params;

      userAuthorization =  Buffer.from(userAuthorization, 'base64').toString('utf-8');

      const [user] = await getUserProfileById(userAuthorization);

      if (!user) return { status_code : 400, message : 'Bad Request', errors: "User not found" };

      const [userCredentials] = await checkCredentials(credentials);

      if (!userCredentials) return { status_code : 400, message : 'Bad Request', errors: "Credentials do not match those of the user" };

      return {};

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