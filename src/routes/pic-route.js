import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { setPICAttedance, getPICAttedances, getWorkOrders, doneWorkOrder } from '../controllers/PICController.js';

const app = express();
const route = express.Router();

route.get('/attedances', authorization, getPICAttedances)
route.get('/work-orders', authorization, getWorkOrders)

route.post('/attedances', authorization, setPICAttedance)
route.put('/work-orders', authorization, doneWorkOrder)


export default route;