const { defineConfig } = require("cypress");
require("dotenv").config({ override: true });

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      watchForFileChanges: true;
    },
    baseUrl: "https://www.saucedemo.com/",
  },
  env: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
