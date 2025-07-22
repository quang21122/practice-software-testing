const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Specify the pattern for test files
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",

    // Base URL for your application
    baseUrl: "http://localhost:4200",

    // Support file
    supportFile: "cypress/support/e2e.js",

    // Fixtures folder
    fixturesFolder: "cypress/fixtures",

    // Screenshots and videos
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Test settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});

