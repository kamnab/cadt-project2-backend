/* - npm run swagger-autogen
*/
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';  // Path for the generated file
const endpointsFiles = ['../routes/tenantRoute.js'];  // Your API route files

const doc = {
    openapi: "3.0.0",  // Specify OpenAPI version
    info: {
        version: "1.0.0",
        title: "CADT Project2 Backend: API Endpoint Documentation",
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
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

// Automatically generate the OpenAPI file
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');  // Your entry point to start the app after docs are generated
});
