import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { setSPVAttedance, getSPVAttedances, getWorkOrders, getWorkOrderById, getPIC, assignWorkOrder, getPICAttedances, checkWorkChecklist } from '../controllers/SPVController.js';

const app = express();
const route = express.Router();

route.get('/pic-attendances', authorization, getPICAttedances)
route.get('/attedances', authorization, getSPVAttedances)
route.get('/work-orders', authorization, getWorkOrders)
route.get('/work-orders/:id', authorization, getWorkOrderById)
route.get('/users-pic', authorization, getPIC)

route.post('/attedances', authorization, setSPVAttedance)
route.post('/work-checklists', authorization, checkWorkChecklist)
route.put('/work-orders', authorization, assignWorkOrder)

export default route;