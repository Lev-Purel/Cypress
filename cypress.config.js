const { defineConfig } = require("cypress");
require("dotenv").config({ override: true });

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      watchForFileChanges: true;
    },
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
