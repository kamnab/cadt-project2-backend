const express = require("express");
const { getTenantById, getTenants, createTenant, joinTenant, setDeletedTenantById, updateTenantById } = require("../controllers/tenantController");
const tenantRouter = express.Router();

//router.get('/:id', idValidator, getTweet)

tenantRouter.get("/tenants/:id", getTenantById);
tenantRouter.get("/tenants", getTenants);
tenantRouter.post("/tenants", createTenant);
tenantRouter.post("/tenants/join", joinTenant);
tenantRouter.delete("/tenants/:id", setDeletedTenantById);
tenantRouter.put("/tenants/:id", updateTenantById);

module.exports = { tenantRouter };
