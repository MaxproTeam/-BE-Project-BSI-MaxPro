import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import { setSPVAttedance, getSPVAttedances } from '../controllers/SPVController.js';

const app = express();
const route = express.Router();

route.get('/attedances', authorization, getSPVAttedances)
route.post('/attedances', authorization, setSPVAttedance)

export default route;