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
const port = 4000;

const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");
const { logger, errorHandle } = require('./middlewares/index.js');
const { introspection } = require('./middlewares/introspection.js');

const { tenantRouter } = require("./routes/tenantRoute.js")

//DB Connect
const dbConnect = require("./db/db.js");
dbConnect().catch((err) => console.log(err));

app.use(cors())
app.use(parser.json());

app.get('/', (req, res) => {
    res.send(`Hello ${!req.user ? 'Annonymous' : req.user.email}!`);
});

app.use(logger);
app.use(introspection)

app.use("/tenants", tenantRouter);
app.use(errorHandle);

// - Use http://
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// - Use https://
const server = https.createServer({ key, cert }, app);
server.listen(443, () => {
    console.log(`INTROSPECT_ENDPOINT ${process.env.INTROSPECT_ENDPOINT}`)
    console.log(`${process.env._NODE_ENV} Server is running on https://localhost:${port}`);
});
