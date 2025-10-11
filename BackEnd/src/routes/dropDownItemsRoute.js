import express from 'express';

import { getAllColleges, getAllCompanies } from 'src/controllers/dropDownItemsController.js';

const router = express.Router();

// Route to get all company names for dropdown
router.get('/companiesName', getAllCompanies);

// get all colleges name for dropdown
router.get('/collegeName' , getAllColleges) ;

export default router;