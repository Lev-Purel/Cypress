const { defineConfig } = require("cypress");
const Ajv = require("ajv");
require("dotenv").config({ override: true });

const uiBaseUrl = "https://www.saucedemo.com/";
const apiBaseUrl = process.env.API_BASE_URL || "https://api.example.com";

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const ajv = new Ajv({ allErrors: true, strict: false });

      on("task", {
        validateSchema({ schema, data }) {
          const validate = ajv.compile(schema);
          const valid = validate(data);
          if (!valid) {
            const msg = ajv.errorsText(validate.errors, {
              separator: "\n",
              dataVar: "response",
            });
            throw new Error(`Schema validation failed:\n${msg}`);
          }
          return true;
        },
      });

      const pickBase = (specPath) => {
        if (!specPath) return null;
        return /cypress[\\/]+e2e[\\/]+api/.test(specPath)
          ? apiBaseUrl
          : uiBaseUrl;
      };

      config.baseUrl = uiBaseUrl;

      const specArgIndex = process.argv.indexOf("--spec");
      if (specArgIndex !== -1) {
        const spec = process.argv[specArgIndex + 1];
        const maybeBase = pickBase(spec);
        if (maybeBase) config.baseUrl = maybeBase;
      } else {
        const patterns = Array.isArray(config.specPattern)
          ? config.specPattern
          : [config.specPattern];
        const maybeBase = patterns
          .map((p) => pickBase(p))
          .find((v) => Boolean(v));
        if (maybeBase) config.baseUrl = maybeBase;
      }

      return config;
    },
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/ui/**/*.cy.js",
    baseUrl: uiBaseUrl,
    testIsolation: true,
  },
  env: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiBaseUrl: process.env.API_BASE_URL,
  },
});
