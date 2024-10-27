const express = require("express");
const { createTenantItem, getTenantItems, getAllTenantItems } = require("../controllers/tenantItemController");
const tenantItemRouter = express.Router();

tenantItemRouter.get("/tenantItems", getAllTenantItems);
tenantItemRouter.post("/tenantItems", createTenantItem);
tenantItemRouter.get("/tenantItems/:tenantId", getTenantItems);

module.exports = { tenantItemRouter };
