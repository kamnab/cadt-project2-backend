const TenantUser = require("../models/tenantUser");
const asyncHandler = require('express-async-handler')

const getAllTenantUsers = async (req, res) => {
    // #swagger.tags = ['TenantUsers']
    // #swagger.description = "get users in the tenant by tenantID"

    const tenantId = req.params.tenantId;

    const tenantUsers = await TenantUser.find({
        tenantId: tenantId,
        isDeleted: false
    }).sort({ createdOn: -1 })
        .lean();

    return res.json(tenantUsers);
};

module.exports = {
    getAllTenantUsers
};