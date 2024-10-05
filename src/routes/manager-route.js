import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { approveWorkOrder, getCompanies, getCompaniesById, getPICAttedancesByCompany, getWorkOrderById, getWorkOrders, getWorkOrdersByCompany } from "../controllers/ManagerController.js";

const route = express.Router();

route.get('/companies', authorization, getCompanies)
route.get('/companies/:id', authorization, getCompaniesById)
route.get('/company/pic-attendances/:id', authorization, getPICAttedancesByCompany)
route.get('/company/work-orders/:id', authorization, getWorkOrdersByCompany)
route.get('/work-orders', authorization, getWorkOrders)
route.get('/work-orders/:id', authorization, getWorkOrderById)

route.put('/work-orders', authorization, approveWorkOrder)

export default route;