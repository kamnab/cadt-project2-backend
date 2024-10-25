const express = require("express");
const { createTenantItem } = require("../controllers/tenantItemController");
const tenantItemRouter = express.Router();

tenantItemRouter.post("/tenantItems", createTenantItem);

module.exports = { tenantItemRouter };
