/* - npm run swagger-autogen
*/
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';  // Path for the generated file
const endpointsFiles = ['../routes/tenantRoute.js'];  // Your API route files

const doc = {
    openapi: "3.0.0",  // Specify OpenAPI version
    info: {
        version: "1.0.0",
        title: "CADT Project2 Backend: API Endpoints",
        description: "API documentation generated with OpenAPI 3.0"
    },
    servers: [
        {
            url: "/",  // Base URL
            description: "Local server"
        }
    ],
    tags: [
        {
            name: "Tenants",
            description: "Tenant management endpoints"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',  // OpenAPI 3.0 uses 'http' for bearer tokens
                scheme: 'bearer',
                bearerFormat: 'JWT',  // Optional JWT format
                in: 'header',
                name: 'Authorization'
            },
            // OAuth2ClientCredentials: {
            //     type: 'oauth2',
            //     flows: {
            //         clientCredentials: {
            //             tokenUrl: 'https://account.codemie.dev/connect/token',
            //             scopes: {
            //                 fapi: 'Access CADT-Project2-Backend API Endpoinds'
            //             }
            //         }
            //     }
            // },
            authorizationCode: {  // Authorization Code Flow
                type: 'oauth2',
                flows: {
                    authorizationCode: {
                        authorizationUrl: 'https://account.codemie.dev/connect/authorize',
                        tokenUrl: 'https://account.codemie.dev/connect/token',
                        scopes: {
                            fapi: 'Access to CADT-Project2-Backend API Endpoints',
                        }
                    }
                }
            }
            /*
authorizationCode (OAuth2, authorizationCode)
Authorized
Authorization URL: https://account.codemie.dev/connect/authorize

Token URL: https://account.codemie.dev/connect/token

Flow: authorizationCode

client_id: ******
client_secret: ******
Logout
*/
        }
    },
    security: [
        {
            bearerAuth: [],
            //OAuth2ClientCredentials: []
            authorizationCode: []  // Referencing authorizationCode flow, not OAuth2ClientCredentials
        }
    ]
};

// Automatically generate the OpenAPI file
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');  // Your entry point to start the app after docs are generated
});
