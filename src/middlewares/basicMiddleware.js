import express from "express";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '../config/config.js';

const basicMiddleware = (app) => {
    app.use(helmet());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser(config.cookie_parse));

    app.use(cors({
        origin: config.cors_origin,
        credentials: true
    }));
}

export default basicMiddleware;