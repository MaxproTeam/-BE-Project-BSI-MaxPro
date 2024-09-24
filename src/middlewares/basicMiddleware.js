import express from "express";
import helmet from "helmet";
import cors from 'cors';

import config from '../config/config.js';

const basicMiddleware = (app) => {
    app.use(helmet());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: config.cors_origin,
        credentials: true
    }));
}

export default basicMiddleware;