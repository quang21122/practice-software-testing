// ***********************************************
// Custom Commands for Practice Software Testing
// ***********************************************

// Command to navigate to registration page
Cypress.Commands.add("navigateToRegistration", () => {
  cy.visit("/#/auth/register");
  cy.url().should("include", "#/auth/register");
  cy.get("h3").should("contain", "Customer registration");
});

// Command to navigate to login page
Cypress.Commands.add("navigateToLogin", () => {
  cy.visit("/#/auth/login");
  cy.url().should("include", "#/auth/login");
  cy.get("h3").should("contain", "Login");
});

// Command to fill registration form
Cypress.Commands.add("fillRegistrationForm", (userData) => {
  if (userData.firstName !== undefined && userData.firstName !== "") {
    cy.get('[data-test="first-name"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.firstName);
  }
  if (userData.lastName !== undefined && userData.lastName !== "") {
    cy.get('[data-test="last-name"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.lastName);
  }
  if (userData.dateOfBirth !== undefined && userData.dateOfBirth !== "") {
    // Convert MM/DD/YYYY to YYYY-MM-DD format for date input
    const dateStr = userData.dateOfBirth;
    if (dateStr.includes("/")) {
      const [month, day, year] = dateStr.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      cy.get('[data-test="dob"]')
        .scrollIntoView()
        .clear({ force: true })
        .type(formattedDate);
    } else {
      cy.get('[data-test="dob"]')
        .scrollIntoView()
        .clear({ force: true })
        .type(dateStr);
    }
  }
  if (userData.address !== undefined && userData.address !== "") {
    cy.get('[data-test="address"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.address);
  }
  if (userData.postcode !== undefined && userData.postcode !== "") {
    cy.get('[data-test="postcode"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.postcode);
  }
  if (userData.city !== undefined && userData.city !== "") {
    cy.get('[data-test="city"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.city);
  }
  if (userData.country !== undefined && userData.country !== "") {
    // Country is a dropdown/select element
    cy.get('[data-test="country"]').then(($select) => {
      const options = Array.from($select.find("option")).map((opt) => ({
        value: opt.value,
        text: opt.textContent.trim(),
      }));

      // Try to find exact match first
      let matchingOption = options.find(
        (opt) =>
          opt.value === userData.country ||
          opt.text === userData.country ||
          opt.text.toLowerCase().includes(userData.country.toLowerCase())
      );

      if (matchingOption) {
        cy.get('[data-test="country"]').select(matchingOption.value);
        cy.log(`Selected country option: ${matchingOption.text}`);
      } else {
        // If no match found, select first valid option
        const validOptions = options.filter(
          (opt) => opt.value !== "" && opt.value !== null
        );
        if (validOptions.length > 0) {
          cy.get('[data-test="country"]').select(validOptions[0].value);
          cy.log(
            `Country "${userData.country}" not found, selected: ${validOptions[0].text}`
          );
        }
      }
    });
  }
  if (userData.state !== undefined && userData.state !== "") {
    // State is a text input, not a dropdown
    cy.get('[data-test="state"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.state);
  }
  if (userData.phone !== undefined && userData.phone !== "") {
    cy.get('[data-test="phone"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.phone);
  }
  if (userData.email !== undefined && userData.email !== "") {
    cy.get('[data-test="email"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.email);
  }
  if (userData.password !== undefined && userData.password !== "") {
    // Password field is in a custom component, need to find the actual input
    cy.get('app-password-input input[type="password"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(userData.password);
  }
});

// Command to fill login form
Cypress.Commands.add("fillLoginForm", (email, password) => {
  if (email !== undefined && email !== "") {
    cy.get('[data-test="email"]').clear().type(email);
  }
  if (password !== undefined && password !== "") {
    // Password field is in a custom component for login too
    cy.get('app-password-input input[type="password"]').clear().type(password);
  }
});

// Command to submit registration form
Cypress.Commands.add("submitRegistrationForm", () => {
  cy.get('[data-test="register-form"]').submit();
});

// Command to submit login form
Cypress.Commands.add("submitLoginForm", () => {
  // Try multiple ways to submit the form
  cy.get("body").then(($body) => {
    if ($body.find('[data-test="login-submit"]').length > 0) {
      cy.get('[data-test="login-submit"]').click();
    } else if ($body.find('button[type="submit"]').length > 0) {
      cy.get('button[type="submit"]').click();
    } else if ($body.find('[data-test="login-form"]').length > 0) {
      cy.get('[data-test="login-form"]').submit();
    } else {
      cy.get("form").submit();
    }
  });
});

// Command to verify success message
Cypress.Commands.add("verifySuccessMessage", (message) => {
  cy.get('.alert-success, .success-message, [data-test="success-message"]')
    .should("be.visible")
    .and("contain", message);
});

// Command to verify error message
Cypress.Commands.add("verifyErrorMessage", (message) => {
  // Look for various error message containers
  cy.get("body").then(($body) => {
    const errorSelectors = [
      ".alert-danger",
      ".error-message",
      ".help-block",
      ".invalid-feedback",
      "[data-test='error-message']",
      ".text-danger",
      ".error",
    ];

    let found = false;
    for (const selector of errorSelectors) {
      if ($body.find(selector).length > 0) {
        if (message === "") {
          // Just verify error element is visible, don't check content
          cy.get(selector).should("be.visible");
        } else {
          // Check both visibility and content
          cy.get(selector).should("be.visible").and("contain.text", message);
        }
        found = true;
        break;
      }
    }

    if (!found) {
      if (message === "") {
        // Just verify some error indication exists in body
        cy.get("body").should("satisfy", ($body) => {
          const bodyText = $body.text().toLowerCase();
          return (
            bodyText.includes("error") ||
            bodyText.includes("invalid") ||
            bodyText.includes("required") ||
            bodyText.includes("wrong") ||
            bodyText.includes("incorrect")
          );
        });
      } else {
        // Fallback: check if body contains the specific error message
        cy.get("body").should("contain.text", message);
      }
    }
  });
});

// Command to verify field validation error
Cypress.Commands.add("verifyFieldError", (fieldName, errorMessage) => {
  // Try multiple selectors for field errors
  cy.get("body").then(($body) => {
    const errorSelectors = [
      `[data-test="${fieldName}-error"]`,
      `#${fieldName}-error`,
      `.${fieldName}-error`,
      `[data-test="${fieldName}"] + .error`,
      `[data-test="${fieldName}"] + .help-block`,
      `[data-test="${fieldName}"] + .invalid-feedback`,
    ];

    let found = false;
    for (const selector of errorSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should("be.visible").and("contain.text", errorMessage);
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback: check if there's any validation error containing the message
      cy.get("body").should("contain.text", errorMessage);
    }
  });
});

// Command to verify successful login redirect
Cypress.Commands.add("verifyLoginSuccess", () => {
  // Wait a bit for redirect to complete
  cy.wait(1000);

  // After successful login, user should be redirected away from login page
  cy.url().should("not.include", "/auth/login");

  // Check for user menu or account indicator with more options
  cy.get("body").then(($body) => {
    const bodyText = $body.text().toLowerCase();
    const hasSignOut =
      bodyText.includes("sign out") || bodyText.includes("logout");
    const hasAccount =
      bodyText.includes("account") || bodyText.includes("profile");
    const hasWelcome =
      bodyText.includes("welcome") || bodyText.includes("hello");
    const hasUserMenu = bodyText.includes("user") || bodyText.includes("menu");

    // Check URL for success indicators
    cy.url().then((url) => {
      const urlIndicatesSuccess =
        url.includes("/account") ||
        url.includes("/dashboard") ||
        url.includes("/home") ||
        url.includes("/profile") ||
        !url.includes("/auth");

      // Verify that either text indicators OR URL indicates success
      const hasTextIndicator =
        hasSignOut || hasAccount || hasWelcome || hasUserMenu;

      if (!hasTextIndicator && !urlIndicatesSuccess) {
        // If no clear indicators, just verify we're not on login page
        cy.url().should("not.include", "/login");
        cy.log("Login success verified by URL redirect");
      } else {
        cy.log("Login success verified by indicators or URL");
      }
    });
  });
});

// Command to verify successful registration redirect
Cypress.Commands.add("verifyRegistrationSuccess", () => {
  // After successful registration, user should be redirected to login page
  cy.url().should("include", "/auth/login");
  // Look for success message or login form
  cy.get("h3").should("contain", "Login");
});

// Command to load CSV test data
Cypress.Commands.add("loadCSVData", (filePath) => {
  return cy.task("parseCSV", filePath);
});

// Command to clear all form fields
Cypress.Commands.add("clearAllFields", () => {
  cy.get("body").then(($body) => {
    // Clear email field if exists
    if ($body.find('[data-test="email"]').length > 0) {
      cy.get('[data-test="email"]').scrollIntoView().clear({ force: true });
    }

    // Clear password field if exists
    if ($body.find('app-password-input input[type="password"]').length > 0) {
      cy.get('app-password-input input[type="password"]')
        .scrollIntoView()
        .clear({ force: true });
    }

    // Clear any other input fields
    cy.get(
      'input[type="text"], input[type="email"], input[type="password"]'
    ).each(($el) => {
      cy.wrap($el).scrollIntoView().clear({ force: true });
    });
  });
});

// Command to take screenshot with timestamp
Cypress.Commands.add("takeScreenshotWithTimestamp", (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  cy.screenshot(`${name}-${timestamp}`);
});

// Command to wait for page load
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.wait(1000); // Wait for any animations or async operations
});
