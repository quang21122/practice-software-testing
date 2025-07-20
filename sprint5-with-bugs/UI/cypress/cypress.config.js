const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Specify the pattern for test files
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",

    // Set the base URL if you have a local server running
    // baseUrl: "http://localhost:4200", // Uncomment and adjust if needed

    // Configure viewport
    viewportWidth: 1280,
    viewportHeight: 720,

    // Configure timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
