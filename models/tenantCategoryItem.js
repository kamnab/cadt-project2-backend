// models/tenantCategoryItem.js

const mongoose = require('mongoose');

const tenantCategoryItemSchema = new mongoose.Schema({
    tenantId: { type: String, require: true },
    categoryId: { type: String, require: true },
    itemId: { type: String, require: true },

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

const tenantCategoryItem = mongoose.model('tenantCategoryItem', tenantCategoryItemSchema);

module.exports = tenantCategoryItem;