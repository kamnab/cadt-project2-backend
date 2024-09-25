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

// - Use http://
// app.listen(port, () => {
//     console.log(`INTROSPECT_ENDPOINT ${process.env.INTROSPECT_ENDPOINT}`)
//     console.log(`Server is running on http://localhost:${port}`);
// });

// - Use https://
const server = https.createServer({ key, cert }, app);
server.listen(port, () => {
    console.log(`INTROSPECT_ENDPOINT ${process.env.INTROSPECT_ENDPOINT}`)
    console.log(`${app.settings.env.toUpperCase()}[${process.env._NODE_ENV}] is running on https://localhost:${port}`);
    console.log(`Swagger docs available at https://localhost:${port}/api-docs`);
});
