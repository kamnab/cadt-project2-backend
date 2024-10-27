// models/tenant.js

const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, default: '', require: true },
    description: { type: String, default: '' },
    inviteCode: { type: String }, // Unique

    // ---------------------------------
    createdByUserId: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },

    isDeleted: { type: Boolean, default: false },
    deletedByUserId: { type: String },
    deletedOn: { type: Date },

    host: { type: String, default: '' },
    origin: { type: String, default: '' },
    referer: { type: String, default: '' }
});

const tenant = mongoose.model('tenant', tenantSchema);

module.exports = tenant;