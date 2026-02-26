const asyncHandler = require('express-async-handler');
const Lead = require('../models/Lead');

// @desc    Get all leads with pagination, search, filter
// @route   GET /api/leads
// @access  Private
const getLeads = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true }; // Only get active leads

    // Search by name, email or phone
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
        ];
    }

    // Filter by status
    if (req.query.status) {
        query.status = req.query.status;
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: leads.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: leads,
    });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead || !lead.isActive) {
        res.status(404);
        throw new Error('Lead not found');
    }

    res.json(lead);
});

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = asyncHandler(async (req, res) => {
    const { name, email, phone, status, source } = req.body;

    const lead = await Lead.create({
        name,
        email,
        phone,
        status,
        source,
    });

    res.status(201).json(lead);
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = asyncHandler(async (req, res) => {
    let lead = await Lead.findById(req.params.id);

    if (!lead || !lead.isActive) {
        res.status(404);
        throw new Error('Lead not found');
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json(lead);
});

// @desc    Soft delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead || !lead.isActive) {
        res.status(404);
        throw new Error('Lead not found');
    }

    // Soft delete using isActive flag
    lead.isActive = false;
    await lead.save();

    res.json({ message: 'Lead removed' });
});

module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
};
