const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Interested', 'Converted', 'Closed'],
            default: 'New',
        },
        source: {
            type: String,
            enum: ['Website', 'Facebook', 'Referral', 'Other'],
            default: 'Other',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
