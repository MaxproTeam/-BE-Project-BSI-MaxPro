import { loginUserSchema, registrationSchema } from '../validations/authValidations.js';
import authServices from '../services/authServices.js';
import encrypt from '../utils/encrypt.js';
import config from '../config/config.js';

const loginUser = async (req, res) => {
  try {
    const { error } = loginUserSchema.validate(req.body, { abortEarly: false });
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

    const result = await authServices.loginUser(req.body);
    if (result.errors) {
      return res.status(400).json({ 
        status_code: result.status_code,
        message: result.message,
        errors: result.errors
      });
    }

    const key = Buffer.from(config.encrypt_key, 'hex');
    const iv = Buffer.from(config.encrypt_iv, 'hex');

    const credentialsEncrypted = encrypt(result.userSession.token, key, iv);
    const authorizationKeyEncrypted = encrypt(result.userProfile.id, key, iv);

    res.cookie('credentials', credentialsEncrypted, {
      httpOnly: true,      
      secure: false,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('key', authorizationKeyEncrypted, {
      httpOnly: true,      
      secure: false,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ 
      status_code: 201,
      message: "Login successful.",
      data: { 
        user: result.userProfile
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


const registerUser = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body, { abortEarly: false });
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

    const result = await authServices.registerUser(req.body);
    if (result.errors) return res.status(400).json({
      status_code : result.status_code,
      message : result.message,
      errors: result.errors
    });

    res.status(201).json({ 
      status_code: 201,
      message: "Registration successful.",
    });

  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      message: 'Internal Server Error',
      errors: err.message
    });
  }
};

export { loginUser, registerUser };