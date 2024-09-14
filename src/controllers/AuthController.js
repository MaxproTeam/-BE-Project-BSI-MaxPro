import express from "express"
import {loginUserSchema} from '../validations/authValidations.js';
import authServices from '../services/authServices.js';

const loginUser = async (req, res, next) => {
    try {
      const { error } = loginUserSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const user = await authServices.loginUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
}

const registerUser = async (req, res, next) => {

}

export {loginUser, registerUser};

