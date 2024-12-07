const TenantCategory = require('../models/tenantCategory')
const TenantCategoryItem = require("../models/tenantCategoryItem");
const asyncHandler = require('express-async-handler')

// required authenticated user to operate the controller, otherwise, return 401 unauthorized access
// something we need to allow anonymous access in the authorized controller

const createTenantCategoryItem = asyncHandler(async (req, res) => {
    // #swagger.tags = ['TenantCategoryItems']
    // #swagger.description = "create new tenantItem"

    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const tenantId = req.params.tenantId;
    //const categoryId = req.params.categoryId;
    const { categoryId, itemId } = req.body;

    let tenantCategoryItem = await TenantCategoryItem.findOne({
        tenantId: tenantId,
        itemId: itemId,
    });

    if (tenantCategoryItem) {
        if (!categoryId) {
            // delete
            tenantCategoryItem.categoryId = '';
            tenantCategoryItem.isDeleted = true;
            const result = await tenantCategoryItem.save();
            return res.json(result);
        }

        if (tenantCategoryItem.isDeleted) {
            tenantCategoryItem.isDeleted = false;
        }
        tenantCategoryItem.categoryId = categoryId;

        const result = await tenantCategoryItem.save();
        return res.json(result);
    }

    tenantCategoryItem = new TenantCategoryItem({
        tenantId: tenantId,
        categoryId: categoryId,
        itemId: itemId,

        createdByUserId: req.user.sub,
        //createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenantItem.validateSync();
    const result = await tenantCategoryItem.save();
    return res.json(result);
});

const getTenantCategoryItems = async (req, res) => {
    // #swagger.tags = ['TenantCategoryItems']
    // #swagger.description = "get all tenants's item owned by tenantID not [logged in user] and is not in deleted status"

    // check if user is authenticated
    // get userId of authenticated user
    // get all tenants by userId and is not in deleted status
    // 
    const tenantId = req.params.tenantId;
    const categoryId = req.params.categoryId;
    const userId = req.user.sub;

    const tenantCategoryItems = await TenantCategoryItem.find({
        tenantId: tenantId,
        categoryId: categoryId,
        isDeleted: false
    }).sort({ createdOn: -1 });
    return res.json(tenantCategoryItems);
};

const updateTenantCategoryItemById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['TenantCategoryItems']
    // #swagger.description = "Move itemId to selected category by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // validate required property ([name]) is not null/empty/white space before update to database
    //    

    const id = req.params.id;
    const userId = req.user.sub;
    const tenantCategoryItem = await TenantCategoryItem.findById(id);

    if (!tenantCategoryItem || (tenantCategoryItem.isDeleted && tenantCategoryItem.userId != userId)) {
        return res.status(404).json({
            error: 'Tenant not found'
        });
    }

    const { categoryId } = req.body

    // Update fields as needed
    tenantCategoryItem.categoryId = categoryId;
    //tenantCategory.description = description;

    // Save the updated tenant back to the database
    await tenantCategoryItem.save();
    return res.json(tenantCategoryItem)
})

// soft delete
const setDeletedTenantCategoryItemById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['TenantCategoryItems']
    // #swagger.description = "Remove item from current tenant category by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // update only isDeleted = from req.Body, deletedByUserId = userId and deletedOn = Date.now

    const id = req.params.id;
    const userId = req.user.sub;
    const tenantCategoryItem = await TenantCategoryItem.findById(id);

    if (!tenantCategoryItem || (tenantCategoryItem.isDeleted && tenantCategoryItem.userId != userId)) {
        return res.status(404).json({
            error: 'Item not found'
        });
    }

    // Update fields as needed
    tenantCategoryItem.isDeleted = true;

    // Save the updated tenant back to the database
    await tenantCategoryItem.save();

    //const updatedTenant = await Tenant.findById(id)
    return res.json(tenantCategoryItem)
})

module.exports = {
    createTenantCategoryItem,
    getTenantCategoryItems,
    updateTenantCategoryItemById,
    setDeletedTenantCategoryItemById
};
