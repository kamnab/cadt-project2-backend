const Tenant = require("../models/tenant");
const asyncHandler = require('express-async-handler')

// required authenticated user to operate the controller, otherwise, return 401 unauthorized access
// something we need to allow anonymous access in the authorized controller

const getTenantById = async (req, res) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "Retrieve tenant by id"

    const id = req.params.id;
    const userId = req.user.sub;
    const tenant = await Tenant.findById(id);

    if (!tenant || (tenant.isDeleted && tenant.userId != userId)) {
        return res.status(404).json({
            error: 'Tenant not found'
        });
    }

    res.json(tenant);
};

const getTenants = async (req, res) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "get all tenants owned by logged in user and is not in deleted status"

    // check if user is authenticated
    // get userId of authenticated user
    // get all tenants by userId and is not in deleted status
    // 
    const userId = req.user.sub;

    const tenants = await Tenant.find({
        createdByUserId: userId,
        isDeleted: false
    }).sort({ 'createdOn': 'desc' });
    return res.json(tenants);
};

// hard delete
const deleteTenantById = asyncHandler(async (req, res) => {
    // #swagger.tags = ['Tenants']
    const id = req.params.id;
    const tenant = await Tenant.deleteOne(id);
    return res.json(tenant);
});

// soft delete
const setDeletedTenantById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "[NOT WORK] delete tenant by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // update only isDeleted = from req.Body, deletedByUserId = userId and deletedOn = Date.now

    const id = req.params.id;
    const userId = req.user.sub;
    const tenant = await Tenant.findById(id);

    if (!tenant || (tenant.isDeleted && tenant.userId != userId)) {
        return res.status(404).json({
            error: 'Tenant not found'
        });
    }

    // Update fields as needed
    tenant.isDeleted = true;

    // Save the updated tenant back to the database
    await tenant.save();

    //const updatedTenant = await Tenant.findById(id)
    return res.json(tenant)
})

const createTenant = asyncHandler(async (req, res) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "create new tenant"

    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const { name, description } = req.body;
    const tenant = new Tenant({
        name: name,
        description: description,

        createdByUserId: req.user.sub,
        //createdOn: utcPlus7Date,

        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer
    });

    //const error = tenant.validateSync();
    const result = await tenant.save();
    return res.json(result);
});

const updateTenantById = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "[NOT WORK] update tenant by id"

    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // validate required property ([name]) is not null/empty/white space before update to database
    //    

    const id = req.params.id;
    const userId = req.user.sub;
    const tenant = await Tenant.findById(id);

    if (!tenant || (tenant.isDeleted && tenant.userId != userId)) {
        return res.status(404).json({
            error: 'Tenant not found'
        });
    }

    const { name, description } = req.body

    // Update fields as needed
    tenant.name = name;
    tenant.description = description;

    // Save the updated tenant back to the database
    await tenant.save();

    //const updatedTenant = await Tenant.findById(id)
    return res.json(tenant)
})

// // use as a Property 
// const utcPlus7Date = (() => {
//     const offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
//     return Date.now() + offset;
// })();

module.exports = {
    getTenantById, getTenants, createTenant, deleteTenantById, setDeletedTenantById, updateTenantById
};
