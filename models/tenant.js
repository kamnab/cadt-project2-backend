// models/tenant.js

const mongoose = require('mongoose');

// Helper function to generate random 4-character alphanumeric string
function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

const tenantSchema = new mongoose.Schema({
    name: { type: String, default: '', require: true },
    description: { type: String, default: '' },
    inviteCode: {
        type: String,
        default: generateRandomString, // chance if 
        unique: true // Ensures the randomString is unique
    },

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