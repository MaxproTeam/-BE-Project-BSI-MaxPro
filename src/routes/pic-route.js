import express from "express";
import authorization from '../middlewares/authorizationMiddleware.js';
import {getPIC, storePIC, updatePIC, deletePIC} from '../controllers/PICController.js';

const app = express();
const route = express.Router();

route.get('/getPIC', authorization, getPIC)
route.post('/storePIC', authorization, storePIC)
route.put('/updatePIC', authorization, updatePIC)
route.delete('/deletePIC', authorization, deletePIC)


export default route;