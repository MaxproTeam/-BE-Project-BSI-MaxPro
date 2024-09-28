import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import {setPICAttedance, getPICAttedances, updatePIC, deletePIC} from '../controllers/PICController.js';

const app = express();
const route = express.Router();

route.get('/attedances', authorization, getPICAttedances)
route.post('/attedances', authorization, setPICAttedance)
route.put('/attedances', authorization, updatePIC)
route.delete('/attedances', authorization, deletePIC)


export default route;