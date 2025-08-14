const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200", // Angular app URL
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,

    // Test file patterns
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // Environment variables for cross-browser testing
    env: {
      supportedBrowsers: ["chrome", "firefox", "edge"],
    },

    setupNodeEvents(on, config) {
      // CSV parsing plugin
      on("task", {
        parseCSV(filePath) {
          const fs = require("fs");
          const path = require("path");
          const csv = require("csv-parser");

          return new Promise((resolve, reject) => {
            const results = [];
            const fullPath = path.resolve(filePath);

            fs.createReadStream(fullPath)
              .pipe(csv())
              .on("data", (data) => results.push(data))
              .on("end", () => resolve(results))
              .on("error", (error) => reject(error));
          });
        },

        // Log messages for debugging
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },
});
