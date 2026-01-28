const { defineConfig } = require("cypress");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
require("dotenv").config({ override: true });

const uiBaseUrl = "https://www.saucedemo.com/";
const apiBaseUrl = "https://restful-booker.herokuapp.com";

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);

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

      const getSpecFromArgv = () => {
        const specFlagIndex = process.argv.indexOf("--spec");
        if (specFlagIndex !== -1) return process.argv[specFlagIndex + 1];
        const withEqual = process.argv.find((arg) => arg.startsWith("--spec="));
        if (withEqual) return withEqual.split("=", 2)[1];
        return null;
      };

      if (process.env.CYPRESS_API_RUN === "true") {
        config.baseUrl = apiBaseUrl;
        return config;
      }

      config.baseUrl = uiBaseUrl;

      const specFromCli = getSpecFromArgv();
      if (specFromCli) {
        const maybeBase = pickBase(specFromCli);
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
    specPattern: [
      "cypress/e2e/ui/**/*.cy.js",
      "cypress/e2e/api/**/*.cy.js",
    ],
    baseUrl: uiBaseUrl,
    testIsolation: true,
  },
  env: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiBaseUrl: process.env.API_BASE_URL,
    api_username: process.env.API_USER,
    api_password: process.env.API_PASSWORD,
  },
});
