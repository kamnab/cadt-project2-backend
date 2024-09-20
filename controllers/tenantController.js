const Tenant = require("../models/tenant");
const asyncHandler = require('express-async-handler')

// required authenticated user to operate the controller, otherwise, return 401 unauthorized access
// something we need to allow anonymous access in the authorized controller

const getTenant = async (req, res) => {
    const id = req.params.id;
    const tenant = await Tenant.findById(id);
    res.json(tenant);
};

const getTenants = async (req, res) => {
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

const deleteTenantById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const tenant = await Tenant.deleteOne(id);
    return res.json(tenant);
});

const setDeletedTenantById = asyncHandler(async (req, res, next) => {
    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // update only isDeleted = from req.Body, deletedByUserId = userId and deletedOn = Date.now

    const id = req.params.id
    const userId = req.user.sub;

    const { createdByUserId, createdOn, isDeleted, deletedByUserId, deletedOn, ...self } = req.body
    const result = await Tenant.updateOne({ ...self, id })
    const tenant = await Tenant.findById(id)
    return res.json({ result, tenant })
})

const createTenant = asyncHandler(async (req, res) => {
    // check if user is authenticated
    // get userId of authenticated user
    // set createdByUserId = userId

    const { name, description } = req.body;
    const tenant = new Tenant({
        name: name,
        description: description,

        createdByUserId: req.user.sub,
        //createdOn: Date.now
    });
    //const error = tenant.validateSync();
    const result = await tenant.save();
    return res.json(result);
});

const updateTenantById = asyncHandler(async (req, res, next) => {
    // check if user is authenticated
    // get userId of authenticated user
    // check if the tenant is belong to the authenticated user and is not deleted 
    // [-] createdByUserId == userId && isDeleted = false
    // validate required property ([name]) is not null/empty/white space before update to database
    //    

    const id = req.params.id
    const { createdByUserId, createdOn, isDeleted, deletedByUserId, deletedOn, ...self } = req.body
    const result = await Tenant.updateOne({ ...self, id })
    const tenant = await Tenant.findById(id)
    return res.json({ result, tenant })
})

module.exports = {
    getTenant, getTenants, createTenant, deleteTenantById, setDeletedTenantById, updateTenantById
};
