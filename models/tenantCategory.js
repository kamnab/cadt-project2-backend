// models/tenantItem.js

const mongoose = require('mongoose');

const tenantCategorySchema = new mongoose.Schema({
    tenantId: { type: String, require: true },
    // articleId, fileId, ....
    name: { type: String, require: true },

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

const tenantCategory = mongoose.model('tenantCategory', tenantCategorySchema);

module.exports = tenantCategory;