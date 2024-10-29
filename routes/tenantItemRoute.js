const express = require("express");
const { createTenantItem, createPublicTenantItem, getTenantItems, getAllTenantItems } = require("../controllers/tenantItemController");
const tenantItemRouter = express.Router();

tenantItemRouter.get("/tenantItems", getAllTenantItems);
tenantItemRouter.post("/tenantItems", createTenantItem);
// tenantItemRouter.post("/public/tenantItems", createPublicTenantItem);
tenantItemRouter.get("/tenantItems/:tenantId", getTenantItems);

module.exports = { tenantItemRouter };
