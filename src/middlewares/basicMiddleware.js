import express from "express";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '../config/config.js';

const basicMiddleware = (app) => {
    app.use(helmet());

    const allowedOrigins = ['https://bsi-max-pro.vercel.app'];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, origin);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

export default basicMiddleware;