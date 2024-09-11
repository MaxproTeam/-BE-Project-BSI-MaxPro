import express from "express";
import {getPIC, storePIC, updatePIC, deletePIC} from '../controllers/PICController.js';

const app = express();
const route = express.Router();

route.get('/getPIC', getPIC)
route.post('/storePIC', storePIC)
route.patch('/updatePIC', updatePIC)
route.delete('/deletePIC', deletePIC)


export default route;