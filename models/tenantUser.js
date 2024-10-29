// models/tenantUser.js

const mongoose = require('mongoose');

const tenantUserSchema = new mongoose.Schema({
    tenantId: { type: String, require: true },
    userName: { type: String, require: true },

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

const tenantUser = mongoose.model('tenantUser', tenantUserSchema);

module.exports = tenantUser;