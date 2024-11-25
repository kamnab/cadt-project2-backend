const express = require("express");
const { createTenantCategory, getTenantCategories, updateTenantCategoryById, setDeletedTenantCategoryById } = require("../controllers/tenantCategoryController");
const tenantCategoryRouter = express.Router();

tenantCategoryRouter.post("/tenantCategories/:tenantId", createTenantCategory);
tenantCategoryRouter.get("/tenantCategories/:tenantId", getTenantCategories);
tenantCategoryRouter.put("/tenantCategories/:id", updateTenantCategoryById);
tenantCategoryRouter.delete("/tenantCategories/:id", setDeletedTenantCategoryById);

module.exports = { tenantCategoryRouter };
