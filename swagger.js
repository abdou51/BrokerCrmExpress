const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Broker CRM API DOCUMENTATION",
      version: "1.0.0",
      description: "Broker Crm Api",
    },
  },
  apis: ["./docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
