import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import htmlspecialchars from 'htmlspecialchars';
import { v4 as uuidv4 } from 'uuid';

import { createUserSession } from '../models/UserSessionModel.js';
import { getUserProfileByUserId, createUserProfile } from '../models/UserProfileModel.js';
import { getUserByUsername, createUser } from '../models/UserModel.js';

import { getWIBTime } from '../utils/time.js';
import createSlug from '../utils/slug.js';
import generateUniqueNumber from '../utils/generateNumber.js';

const authServices = {
  loginUser: async (params) => {
    try {
      let { username, password } = {
        username : htmlspecialchars(params.username),
        password : htmlspecialchars(params.password)
      };

      const [user] = await getUserByUsername(username);

      if (!user) return { status_code : 400, message : 'Bad Request', errors: 'Username atau Password salah.' };

      const match = await bcrypt.compare(password, user.password);
      if (!match) return { status_code : 400, message : 'Bad Request', errors: 'Username atau Password salah.' };

      const [userProfile] = await getUserProfileByUserId(user.id);

      const userSession = await createUserSession({
        id : uuidv4(),
        userid : userProfile.id,
        token : crypto.randomBytes(16).toString('base64url'),
        expiredAt : getWIBTime(24),
        createdAt : getWIBTime(),
        updatedAt : getWIBTime()
      });

      delete userProfile.created_at;
      delete userProfile.updated_at;
      delete userProfile.userid;

      return {userProfile, userSession};

    } catch (err) {
      return res.status(500).json({
        status_code: 500,
        message: 'Internal Server Error',
        errors: err.message
      });
    }
  },

  registerUser: async (params) => {
    try {
      const { fullname, email, password } = {
        fullname : htmlspecialchars(params.fullname),
        email : htmlspecialchars(params.email),
        password : htmlspecialchars(params.password)
      };
      
      const userid = uuidv4();
      const username = generateUniqueNumber() + createSlug(fullname);
      const createdAt = getWIBTime();
      const updatedAt = getWIBTime();

      const [user] = await getUserByUsername(username);

      if (user) return { status_code : 400, message : 'Bad Request', errors: 'Username sudah dipakai.' };
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userCreated = await createUser({
        userid,
        username, 
        email : email ? email : null, 
        hashedPassword,
        createdAt,
        updatedAt
      });

      if (!userCreated) return { status_code : 400, message : 'Bad Request', errors: 'Registrasi gagal.' };

      const userprofilesid = uuidv4();
      const agency_project = '';
      const role = 1;

      const userProfileCreated = await createUserProfile({
        userprofilesid,
        userid : userCreated.id,
        fullname,
        agency_project,
        role,
        createdAt,
        updatedAt
      })

      if (!userProfileCreated) return { status_code : 400, message : 'Bad Request', errors: 'Profile user gagal dibuat.' };

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

export default authServices;