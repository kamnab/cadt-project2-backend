// index.js

require('dotenv').config({
    //path: `.env.${process.env.NODE_ENV}`
})
const fs = require("fs");
const https = require("https");
const parser = require("body-parser");
const cors = require('cors')

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const env = app.settings.env.toUpperCase();
const isDev = env == 'DEVELOPMENT';

const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");
const { logger, errorHandle } = require('./middlewares/index.js');
const { introspection } = require('./middlewares/introspection.js');

const { tenantRouter } = require("./routes/tenantRoute.js")

// swagger autogen
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger/swagger_output.json')

//DB Connect
const dbConnect = require("./db/db.js");
dbConnect().catch((err) => console.log(err));

app.use(cors())
app.use(parser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/', (req, res) => {
    res.send(`Hello ${!req.user ? 'Annonymous' : req.user.email}!`);
});

app.use(logger);

app.use(introspection)

app.use(tenantRouter);
app.use(errorHandle);

if (!isDev) {
    // - Use http://
    // - DEPLOY to heroku using this, otherwise, the server is not working.
    app.listen(port, function () {
        const host = this.address().address === '::' ? 'localhost' : server.address().address;
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