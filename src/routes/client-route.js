import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { setWorkOrder, getWorkOrders, getPICAttedances, getSPVAttedances } from '../controllers/ClientController.js';

const app = express();
const route = express.Router();

route.get('/pic-attendances', authorization, getPICAttedances)
route.get('/spv-attendances', authorization, getSPVAttedances)
route.post('/work-orders', authorization, setWorkOrder)
route.get('/work-orders', authorization, getWorkOrders)

export default route;