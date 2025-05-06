import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpecs = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "TOP-IT API",
            version: "1.0.0",
            description:
                "TOP-IT API is a RESTful API that provides endpoints for control TOP-IT services",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: `${process.env.BASE_URL}:${process.env.APP_PORT}/`,
            },
        ],
    },
    apis: ["./src/controllers/**/*.*s", "./src/models/**/*.*s",],
};

const options = {
    customSiteTitle: "TOP-IT API",
};

const specs = swaggerJSDoc(swaggerSpecs);
export { options, specs };