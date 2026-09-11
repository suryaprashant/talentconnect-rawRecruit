import express from 'express';
import { getAllColleges, getAllCompanies } from '../controllers/dropDownItemsController.js';
import {
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.get(
    '/companiesName',
    searchLimiter,
    getAllCompanies
);


router.get(
    '/collegeName',
    searchLimiter,
    getAllColleges
);

export default router;