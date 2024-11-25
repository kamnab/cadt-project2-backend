const TenantCategory = require("../models/tenantCategory");
const asyncHandler = require('express-async-handler')

// required authenticated user to operate the controller, otherwise, return 401 unauthorized access
// something we need to allow anonymous access in the authorized controller

const createTenantCategory = asyncHandler(async (req, res) => {
    // #swagger.tags = ['TenantCategories']
    // #swagger.description = "create new tenantCategory"

    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const tenantId = req.params.tenantId;
    const { name } = req.body;
    const tenantCategory = new TenantCategory({
        tenantId: tenantId,
        name: name,

        createdByUserId: req.user.sub,
        //createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenantItem.validateSync();
    const result = await tenantCategory.save();
    return res.json(result);
});

const getTenantCategories = async (req, res) => {
    // #swagger.tags = ['TenantItems']
    // #swagger.description = "get all tenants's item owned by tenantID not by [logged in user] and is not in deleted status"

    // check if user is authenticated
    // get userId of authenticated user
    // get all tenants by userId and is not in deleted status
    // 
    const tenantId = req.params.tenantId;
    const userId = req.user.sub;

    const tenantCategories = await TenantCategory.find({
        tenantId: tenantId,
        isDeleted: false
    }).sort({ createdOn: -1 })
        .lean();
    return res.json(tenantCategories);
};


const updateTenantCategoryById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['TenantCategories']
    // #swagger.description = "Update tenant category by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // validate required property ([name]) is not null/empty/white space before update to database
    //    

    const id = req.params.id;
    const userId = req.user.sub;
    const tenantCategory = await TenantCategory.findById(id);

    if (!tenantCategory || (tenantCategory.isDeleted && tenantCategory.userId != userId)) {
        return res.status(404).json({
            error: 'Tenant not found'
        });
    }

    const { name } = req.body

    // Update fields as needed
    tenantCategory.name = name;
    //tenantCategory.description = description;

    // Save the updated tenant back to the database
    await tenantCategory.save();
    return res.json(tenantCategory)
})

// soft delete
const setDeletedTenantCategoryById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['TenantCategories']
    // #swagger.description = "Set delete tenant category by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // update only isDeleted = from req.Body, deletedByUserId = userId and deletedOn = Date.now

    const id = req.params.id;
    const userId = req.user.sub;
    const tenantCategory = await TenantCategory.findById(id);

    if (!tenantCategory || (tenantCategory.isDeleted && tenantCategory.userId != userId)) {
        return res.status(404).json({
            error: 'Category not found'
        });
    }

    // Update fields as needed
    tenantCategory.isDeleted = true;

    // Save the updated tenant back to the database
    await tenantCategory.save();

    //const updatedTenant = await Tenant.findById(id)
    return res.json(tenantCategory)
})

module.exports = {
    createTenantCategory,
    getTenantCategories,
    updateTenantCategoryById,
    setDeletedTenantCategoryById
};
