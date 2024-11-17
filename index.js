// index.js

const fs = require("fs");
const https = require("https");
const parser = require("body-parser");
const cors = require('cors')
const path = require('path')

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const env = app.settings.env.toUpperCase();
const isDev = env == 'DEVELOPMENT';

require('dotenv').config(isDev ? {
    //path: `.env.${process.env.NODE_ENV}`
} : {})
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");
const { logger, errorHandle } = require('./middlewares/index.js');
const { introspection } = require('./middlewares/introspection.js');

const { tenantRouter } = require("./routes/tenantRoute.js")
const { tenantItemRouter } = require("./routes/tenantItemRoute.js")
const { tenantUserRouter } = require("./routes/tenantUserRoute.js")

// swagger autogen
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger/swagger_output.json')

//DB Connect
const dbConnect = require("./db/db.js");
dbConnect().catch((err) => console.log(err));

app.use(cors())
app.use(parser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
        oauth: {
            clientId: 'mobile-client-swagger',
            clientSecret: 'CADT-PROJECT2-MOBILE-CLIENT-2024',

            useBasicAuthenticationWithAccessCodeGrant: true,
            usePkceWithAuthorizationCodeGrant: true,
            // Default scopes to be pre-selected
            scopes: "fapi"
        }
    }
}))

app.get('/', (req, res) => {
    res.send(`Hello ${!req.user ? 'Annonymous' : req.user.email}!`);
});

// app.get('/public/tenantItems', createPublicTenantItem);

app.use(introspection)
app.use(logger);

app.use(tenantRouter);
app.use(tenantItemRouter);
app.use(tenantUserRouter);
app.use(errorHandle);

if (!isDev) {
    // - Use http://
    // - DEPLOY to heroku using non-SSL [http://] because heroku will provide SSL [https://] by default, otherwise, the server is not working.
    app.listen(port, function () {
        var address = this.address().address;
        const host = address === '::' ? 'localhost' : address;
        const port = this.address().port;
        const baseUrl = `https://${host}:${port}`;

        console.log(`---`)
        console.log(`Express server is running on ${baseUrl} in ${env} mode with [${process.env._NODE_ENV}]`);
        console.log(`INTROSPECT_ENDPOINT ${process.env.INTROSPECT_ENDPOINT}`)
        console.log(`Swagger docs available at ${baseUrl}/api-docs`)
        console.log(`---`)
    });
} else {
    // - Use https://
    const server = https.createServer({ key, cert }, app);
    server.listen(port, function () {
        const host = this.address().address === '::' ? 'localhost' : server.address().address;
        const port = this.address().port;
        const baseUrl = `https://${host}:${port}`;

        console.log(`---`)
        console.log(`Express server is running on ${baseUrl} in ${env} mode with [${process.env._NODE_ENV}]`);
        console.log(`INTROSPECT_ENDPOINT ${process.env.INTROSPECT_ENDPOINT}`)
        console.log(`Swagger docs available at ${baseUrl}/api-docs`)
        console.log(`---`)

    });
}