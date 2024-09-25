// models/tenant.js

const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    inviteCode: { type: String }, // Unique

    createdByUserId: {
        type: String
    },
    createdOn: {
        type: Date,
        //default: Date.now
    },

    isDeleted: { type: Boolean, default: false },
    deletedByUserId: { type: String },
    deletedOn: { type: Date }
});

const tenant = mongoose.model('tenant', tenantSchema);

module.exports = tenant;