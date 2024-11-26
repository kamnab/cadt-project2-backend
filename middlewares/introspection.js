// npm install axios

const asyncHandler = require('express-async-handler')
const axios = require('axios');
const prodSettings = process.env._NODE_ENV == 'PROD Settings'; // production auth server

/* 
    To further enhance security, you can use Certificate Public Key export from authorization server. 
    This ensures that only specific, known certificates are accepted, preventing man-in-the-middle attacks.
    If the server changes its certificate, Certificate Public Key will still be trusted as long as the public key remains the same.

    Using Axios:
    Download the server’s public certificate and save it as localhost-server.pem.
    Use the certificate in the Axios request.
*/


const https = require('https')
const fs = require("fs");
const agent = new https.Agent({
    ca: fs.readFileSync('localhost-server.pem')
});

// Middleware for token introspection
const introspection = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthorized Access!' });
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token

    // Make a request to the introspection endpoint
    const introspectionResponse = await axios.post(
        // Authorization server introspection endpoint
        process.env.INTROSPECT_ENDPOINT,
        // 
        new URLSearchParams({
            token: token,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            /* required public certificate from localhost authorization server to be able to make a request */
            httpsAgent: prodSettings ? null : agent
        }
    );

    /*
        {
            "active": true,
            "iss": "https://localhost:44313/",
            "username": "k@gmail.com",
            "sub": "1595765d-09b6-48c3-a82b-82a14c26604c",
            "scope": "openid email profile fapi",
            "jti": "565c1c24-1e9c-4174-bf72-350818c01387",
            "token_type": "Bearer",
            "token_usage": "access_token",
            "client_id": "CODEMIE-E7FE-42CB-B10D-61EF6A8F3654",
            "iat": 1726302421,
            "nbf": 1726302421,
            "exp": 1726302721,
            "aud": [
                "file-api-service",
                "cadt-project2-backend"
            ],
            "email": "k@gmail.com",
            "name": "k@gmail.com",
            "preferred_username": "k@gmail.com"
        }
    */
    const tokenData = introspectionResponse.data;

    if (!tokenData.active) {
        return res.status(401).send({ error: 'Your token is invalid.' });
    }

    // If token is active, attach the token data to the request object
    req.user = tokenData;

    next(); // Continue to the next middleware
});

module.exports = { introspection }