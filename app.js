import express from "express";

import config from './src/config/config.js';
import auth from './src/routes/auth-routes.js';
import pic from './src/routes/pic-route.js';

const app = express();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

app.use('/auth', auth)
app.use('/pic', pic)