const express = require("express");
const { getTenant, getTenants, createTenant, setDeletedTenantById, updateTenantById } = require("../controllers/tenantController");
const tenantRouter = express.Router();

//router.get('/:id', idValidator, getTweet)
tenantRouter.get("/:id", getTenant);
tenantRouter.get("/", getTenants);
tenantRouter.post("/", createTenant);
tenantRouter.delete("/:id", setDeletedTenantById);
tenantRouter.put("/:id", updateTenantById);

module.exports = { tenantRouter };
