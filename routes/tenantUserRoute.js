const express = require("express");
const { getAllTenantUsers } = require("../controllers/tenantUserController")
const tenantUserRouter = express.Router();

//router.get('/:id', idValidator, getTweet)

tenantUserRouter.get("/tenantUsers/:tenantId", getAllTenantUsers);

module.exports = { tenantUserRouter };
