const TenantItem = require("../models/tenantItem");
const asyncHandler = require('express-async-handler')

// required authenticated user to operate the controller, otherwise, return 401 unauthorized access
// something we need to allow anonymous access in the authorized controller

const createTenantItem = asyncHandler(async (req, res) => {
    // #swagger.tags = ['TenantItems']
    // #swagger.description = "create new tenantItem"

    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const { tenantId, itemId } = req.body;
    const tenantItem = new TenantItem({
        tenantId: tenantId,
        itemId: itemId,

        createdByUserId: req.user.sub,
        createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenantItem.validateSync();
    const result = await tenantItem.save();
    return res.json(result);
});

// use as a Property 
const utcPlus7Date = (() => {
    const offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
    return Date.now() + offset;
})();

module.exports = {
    createTenantItem
};
