const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyBySlug, seedCompanies } = require('../controllers/companyController');

router.get('/', getAllCompanies);
router.post('/seed', seedCompanies);
router.get('/:slug', getCompanyBySlug);

module.exports = router;
