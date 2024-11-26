const express = require("express");
const { createTenantCategoryItem, getTenantCategoryItems, updateTenantCategoryItemById, setDeletedTenantCategoryItemById } = require("../controllers/tenantCategoryItemController");
const tenantCategoryItemRouter = express.Router();

tenantCategoryItemRouter.get("/tenants/:tenantId/categories/:categoryId", getTenantCategoryItems);
tenantCategoryItemRouter.post("/tenants/:tenantId/categories/:categoryId", createTenantCategoryItem);
tenantCategoryItemRouter.put("/tenants/category-items/:id", updateTenantCategoryItemById);
tenantCategoryItemRouter.delete("/tenants/category-items/:id", setDeletedTenantCategoryItemById);

module.exports = { tenantCategoryItemRouter };
