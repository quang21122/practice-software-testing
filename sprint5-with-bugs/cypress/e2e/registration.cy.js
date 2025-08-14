/// <reference types="cypress" />

// Import test data synchronously using require
const testData = require("../fixtures/registration-test-data.json");

describe("User Registration Tests - Data Driven", () => {
  beforeEach(() => {
    // Navigate to registration page before each test
    cy.navigateToRegistration();
    cy.waitForPageLoad();
  });

  // Create individual test cases for each row in test data
  testData.forEach((testCaseData) => {
    it(`[${testCaseData.testId}] ${testCaseData.testDescription}`, () => {
      cy.log(`Test Case ID: ${testCaseData.testId}`);
      cy.log(`Test Description: ${testCaseData.testDescription}`);
      cy.log(`Test Type: ${testCaseData.testType}`);
      cy.log(`Expected Result: ${testCaseData.expectedResult}`);

      // Clear form before test
      cy.clearAllFields();

      // Fill the registration form with test data
      const userData = {
        firstName: testCaseData.firstName,
        lastName: testCaseData.lastName,
        dateOfBirth: testCaseData.dateOfBirth,
        address: testCaseData.address,
        postcode: testCaseData.postcode,
        city: testCaseData.city,
        country: testCaseData.country,
        state: testCaseData.state,
        phone: testCaseData.phone,
        email: testCaseData.email,
        password: testCaseData.password,
      };

      cy.fillRegistrationForm(userData);
      cy.submitRegistrationForm();

      // Checkpoint: Verify expected result based on test case
      if (testCaseData.expectedResult === "success") {
        // Checkpoint: Verify successful registration
        cy.verifyRegistrationSuccess();
        cy.log(
          `✅ CHECKPOINT PASSED: ${testCaseData.testId} - Registration successful`
        );
      } else if (testCaseData.expectedResult === "error") {
        // Checkpoint: Verify error message appears
        cy.get(
          ".alert-danger, .error-message, .help-block, .invalid-feedback"
        ).should("be.visible");
        cy.log(
          `✅ CHECKPOINT PASSED: ${testCaseData.testId} - Error validation working`
        );
      }

      // Take screenshot with test case ID
      cy.takeScreenshotWithTimestamp(`${testCaseData.testId}-registration`);

      // Log completion
      cy.task(
        "log",
        `Completed test case: ${testCaseData.testId} - ${testCaseData.testDescription}`
      );
    });
  });

  afterEach(() => {
    // Clean up after each test
    cy.task("log", `Completed test: ${Cypress.currentTest.title}`);
  });
});
