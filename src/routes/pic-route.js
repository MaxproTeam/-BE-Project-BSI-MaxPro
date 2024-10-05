import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { setPICAttedance, getPICAttedances } from '../controllers/PICController.js';

const app = express();
const route = express.Router();

route.get('/attedances', authorization, getPICAttedances)
route.post('/attedances', authorization, setPICAttedance)

export default route;