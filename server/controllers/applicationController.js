const JobApplication = require('../models/JobApplication');

// @desc    Get user applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    const applications = await JobApplication.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(applications);
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    const { company, position, status, dateApplied, notes } = req.body;

    if (!company || !position) {
        return res.status(400).json({ message: 'Please add company and position' });
    }

    const application = await JobApplication.create({
        user: req.user.id,
        company,
        position,
        status,
        dateApplied,
        notes,
    });

    res.status(201).json(application);
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the application user
    if (application.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedApplication);
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the application user
    if (application.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await application.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
};
