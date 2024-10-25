// models/tenantItem.js

const mongoose = require('mongoose');

const tenantItemSchema = new mongoose.Schema({
    tenantId: { type: String, require: true },
    // articleId, fileId, ....
    itemId: { type: String, require: true },

    // save [id] of the parent record in this entity
    forwardId: { type: String, default: '' },

    // ---------------------------------
    createdByUserId: {
        type: String
    },
    createdOn: {
        type: Date,
        //default: Date.now
    },

    isDeleted: { type: Boolean, default: false },
    deletedByUserId: { type: String },
    deletedOn: { type: Date },

    host: { type: String, default: '' },
    origin: { type: String, default: '' },
    referer: { type: String, default: '' }
});

const tenantItem = mongoose.model('tenantItem', tenantItemSchema);

module.exports = tenantItem;