const express = require("express");
const expressApp = express();
// Import swaggerJsdoc and swaggerUi
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Demo API",
      version: "1.0.0",
      description: "this is a project created by bishwojit malo",
    },
    servers: [
      {
        url: "http://localhost:9001/api/v1",
        description: "General User Portal"
      },
      {
        url: "http://localhost:9001",
        description: "Admin Portal"
      }
    ],
  },
  apis: ["../../src/**/*/routes/*.js"],
});
/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  if (process.env.NODE_ENV === "development") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
};

