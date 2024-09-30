import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import {setSPVAttedance, getSPVAttedances, updateSPV, deleteSPV} from '../controllers/SPVController.js';

const app = express();
const route = express.Router();

route.get('/attedances', authorization, getSPVAttedances)
route.post('/attedances', authorization, setSPVAttedance)
route.put('/attedances', authorization, updateSPV)
route.delete('/attedances', authorization, deleteSPV)


export default route;