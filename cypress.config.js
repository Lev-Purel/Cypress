const { defineConfig } = require("cypress");
require("dotenv").config({ override: true });

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const specArgIndex = process.argv.indexOf("--spec");
      if (specArgIndex !== -1) {
        const spec = process.argv[specArgIndex + 1];
        if (spec.includes("cypress/e2e/api")) {
          config.baseUrl =
            process.env.API_BASE_URL || "https://api.example.com";
        } else if (spec.includes("cypress/e2e/ui")) {
          config.baseUrl = "https://www.saucedemo.com/";
        }
      }
      return config;
    },
    supportFile: "cypress/support/ui/e2e.js",
    specPattern: "cypress/e2e/ui/**/*.cy.js",
    baseUrl: "https://www.saucedemo.com/",
    testIsolation: true,
  },
  env: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiBaseUrl: process.env.API_BASE_URL,
    API_TOKEN: process.env.API_TOKEN,
  },
});
