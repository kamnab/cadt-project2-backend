const Tenant = require("../models/tenant");
const TenantUser = require("../models/tenantUser");
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

    const tenantUsers = await TenantUser.find({
        createdByUserId: userId,
        isDeleted: false,
    });

    const tenantIds = tenantUsers.map((t) => t.tenantId);
    // const tenants = await Tenant.find({
    //     $or: [
    //         { _id: { $in: tenantIds } },    // Match tenant IDs
    //         { createdByUserId: userId }     // OR match createdByUserId
    //     ],
    //     isDeleted: false
    // });

    // Step 2: Query tenants by tenant IDs
    const tenantMatches = await Tenant.find({
        _id: { $in: tenantIds },
        isDeleted: false
    }).lean();  // Use .lean() to get plain JavaScript objects

    // Add a custom field to indicate match by tenantId
    tenantMatches.forEach(tenant => {
        tenant.createdByUserId = null;
    });

    // Step 3: Query tenants by createdByUserId
    const userIdMatches = await Tenant.find({
        createdByUserId: userId,
        isDeleted: false
    }).lean();

    // Step 4: Combine both results
    const tenants = [...tenantMatches, ...userIdMatches];

    return res.json(tenants.sort({ createdOn: -1 }));
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
    const headers = req.headers;
    const userId = req.user.sub;
    const result = await createTenantWithUniqueCode(name, description, userId, headers);

    return res.json(result);
});

const createTenantWithUniqueCode = async (name, description, userId, headers) => {
    try {
        const tenant = new Tenant({
            name: name,
            description: description,

            createdByUserId: userId,
            //createdOn: utcPlus7Date,

            host: headers.host,
            origin: headers.origin,
            referer: headers.referer
        });
        //const error = tenant.validateSync();
        const result = await tenant.save();
        return result;
    } catch (error) {
        if (error.code === 11000) { // 11000 is MongoDB duplicate key error code
            console.warn('Duplicate randomString detected. Retrying...');
            // Retry by recursively calling the function
            return createTenantWithUniqueCode(name, description, userId, headers);
        } else {
            // Handle other errors or if retries are exhausted
            console.error('Failed to save document:', error);
            throw error; // or handle it as per your use case
        }
    }
}

const joinTenant = async (req, res) => {
    // #swagger.tags = ['Tenants']
    // #swagger.description = "join tenant by code"

    const { code } = req.body
    const userId = req.user.sub;
    const userName = req.user.name;
    const tenant = await Tenant.findOne({ inviteCode: code });

    if (!tenant || (tenant.isDeleted)) {
        return res.status(404).json({
            error: 'Not found'
        });
    }

    const tenantUser = await TenantUser.findOne({ tenantId: tenant._id, createdByUserId: userId });
    if (tenantUser) {
        if (!tenantUser.isDeleted) {
            tenantUser.isDeleted = true;
        }
    } else {
        tenantUser = TenantUser({
            tenantId: tenant._id,
            userName: userName,
            createdByUserId: userId
        })
    }

    await tenantUser.save();
    res.json(tenantUser);
};

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
    getTenantById, getTenants, createTenant, joinTenant, deleteTenantById, setDeletedTenantById, updateTenantById
};
