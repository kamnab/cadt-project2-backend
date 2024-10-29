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
        //createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenantItem.validateSync();
    const result = await tenantItem.save();
    return res.json(result);
});
const createPublicTenantItem = asyncHandler(async (req, res) => {
    // #swagger.tags = ['TenantItems']
    // #swagger.description = "create new tenantItem"

    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const { tenantId, itemId, userId } = req.body;
    const tenantItem = new TenantItem({
        tenantId: tenantId,
        itemId: itemId,

        createdByUserId: userId,
        //createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenantItem.validateSync();
    const result = await tenantItem.save();
    return res.json(result);
});

const getAllTenantItems = async (req, res) => {
    // #swagger.tags = ['TenantItems']
    // #swagger.description = "get all tenants's item owned by tenantID not [logged in user] and is not in deleted status"

    // check if user is authenticated
    // get userId of authenticated user
    // get all tenants by userId and is not in deleted status
    // 
    const tenantId = req.params.tenantId;
    const userId = req.user.sub;

    const tenantItems = await TenantItem.find().sort({ 'createdOn': 'desc' });
    return res.json(tenantItems);
};

const getTenantItems = async (req, res) => {
    // #swagger.tags = ['TenantItems']
    // #swagger.description = "get all tenants's item owned by tenantID not [logged in user] and is not in deleted status"

    // check if user is authenticated
    // get userId of authenticated user
    // get all tenants by userId and is not in deleted status
    // 
    const tenantId = req.params.tenantId;
    const userId = req.user.sub;

    const tenantItems = await TenantItem.find({
        tenantId: tenantId,
        isDeleted: false
    }).sort({ createdOn: -1 });
    return res.json(tenantItems);
};

module.exports = {
    getAllTenantItems,
    createTenantItem,
    createPublicTenantItem,
    getTenantItems
};
