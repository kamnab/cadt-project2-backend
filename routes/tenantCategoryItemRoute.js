const express = require("express");
const { createTenantCategoryItem, getTenantCategoryItems, updateTenantCategoryItemById, setDeletedTenantCategoryItemById } = require("../controllers/tenantCategoryItemController");
const tenantCategoryItemRouter = express.Router();

tenantCategoryItemRouter.get("/tenantCategoryItems/:tenantId", getTenantCategoryItems);
tenantCategoryItemRouter.post("/tenantCategoryItems/:tenantId", createTenantCategoryItem);
tenantCategoryItemRouter.put("/tenantCategoryItems/:id", updateTenantCategoryItemById);
tenantCategoryItemRouter.delete("/tenantCategoryItems/:id", setDeletedTenantCategoryItemById);

module.exports = { tenantCategoryItemRouter };
