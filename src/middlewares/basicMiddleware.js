import express from "express";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '../config/config.js';

const basicMiddleware = (app) => {
    app.use(helmet());

    app.use(cors({
        origin: config.cors_origin,
        credentials: true
    }));

    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

export default basicMiddleware;