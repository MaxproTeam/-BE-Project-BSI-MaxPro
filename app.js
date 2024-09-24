import express from "express";

import basicMiddleware from './src/middlewares/basicMiddleware.js';
import startServer from "./src/config/server.js";
import auth from './src/routes/auth-routes.js';
import pic from './src/routes/pic-route.js';

const app = express();

basicMiddleware(app);

app.use('/api/v1/auth', auth);
app.use('/api/v1/pic', pic);

startServer(app);