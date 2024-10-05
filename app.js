import express from "express";

import basicMiddleware from './src/middlewares/basicMiddleware.js';
import startServer from "./src/config/server.js";
import auth from './src/routes/auth-routes.js';
import pic from './src/routes/pic-route.js';
import spv from './src/routes/spv-route.js';
import client from './src/routes/client-route.js';
import manager from './src/routes/manager-route.js';

const app = express();

basicMiddleware(app);

app.use('/api/v1/auth', auth);
app.use('/api/v1/pic', pic);
app.use('/api/v1/spv', spv);
app.use('/api/v1/manager', manager)
app.use('/api/v1/client', client)

startServer(app);