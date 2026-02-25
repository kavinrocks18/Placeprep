const CompanyRoadmap = require('../models/CompanyRoadmap');
const companyData = require('../data/companyData');

// @desc    Get all companies (summary view)
// @route   GET /api/companies
const getAllCompanies = async (req, res) => {
    try {
        let companies = await CompanyRoadmap.find({})
            .select('companyName slug overview difficultyLevel industry averagePackage importantTopics')
            .sort({ companyName: 1 });

        // Auto-seed if empty
        if (companies.length === 0) {
            await CompanyRoadmap.insertMany(companyData);
            companies = await CompanyRoadmap.find({})
                .select('companyName slug overview difficultyLevel industry averagePackage importantTopics')
                .sort({ companyName: 1 });
        }

        res.status(200).json(companies);
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({ message: 'Failed to fetch companies' });
    }
};

// @desc    Get company by slug
// @route   GET /api/companies/:slug
const getCompanyBySlug = async (req, res) => {
    try {
        const company = await CompanyRoadmap.findOne({ slug: req.params.slug });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        console.error('Get company error:', error);
        res.status(500).json({ message: 'Failed to fetch company' });
    }
};

// @desc    Seed company data
// @route   POST /api/companies/seed
const seedCompanies = async (req, res) => {
    try {
        await CompanyRoadmap.deleteMany({});
        await CompanyRoadmap.insertMany(companyData);
        res.status(201).json({ message: `${companyData.length} companies seeded successfully` });
    } catch (error) {
        console.error('Seed companies error:', error);
        res.status(500).json({ message: 'Failed to seed companies' });
    }
};

module.exports = { getAllCompanies, getCompanyBySlug, seedCompanies };
