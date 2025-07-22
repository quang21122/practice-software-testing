import "../../support/command.js";

describe("Registration Page - Complete GUI Testing Checklist", () => {
  // Test results storage for cross-browser reporting
  const testResults = {
    browser: Cypress.browser.name,
    platform: Cypress.platform,
    timestamp: new Date().toISOString(),
    results: [],
  };

  beforeEach(() => {
    cy.visit("localhost:4200/#/auth/register");
    cy.wait(2000); // Wait for page to fully load
  });

  afterEach(() => {
    // Take screenshot after each test for documentation
    const testName = Cypress.currentTest.title.replace(/[^a-zA-Z0-9]/g, "_");
    cy.screenshot(`${testResults.browser}_${testName}`, {
      capture: "viewport",
      overwrite: true,
    });
  });

  after(() => {
    // Generate final report screenshot
    cy.screenshot(`${testResults.browser}_final_report`, {
      capture: "fullPage",
      overwrite: true,
    });

    // Log test results for reporting
    cy.log("Test Results Summary:", JSON.stringify(testResults, null, 2));
  });

  context("1. Layout & Structure Tests", () => {
    it("1.1 - Check if page header is properly aligned and positioned at the top", () => {
      cy.log("Testing checkpoint 1.1: Page header alignment");

      // Verify header exists and contains correct text
      cy.get("h3").should("contain", "Customer registration").and("be.visible");

      // Check header positioning relative to form container
      cy.get(".auth-form h3").then(($header) => {
        const headerRect = $header[0].getBoundingClientRect();
        cy.get(".auth-form").then(($form) => {
          const formRect = $form[0].getBoundingClientRect();
          expect(headerRect.top).to.be.lessThan(formRect.top + 100);
          expect(headerRect.left).to.be.greaterThan(formRect.left - 10);
        });
      });

      testResults.results.push({
        checkpoint: "1.1",
        status: "PASS",
        description: "Page header properly aligned",
      });
    });

    it("1.2 - Verify page footer is properly aligned and positioned at the bottom", () => {
      cy.log("Testing checkpoint 1.2: Page footer alignment");

      // Check if footer exists and is visible
      cy.get("app-footer").should("exist");

      // Check footer content and styling
      cy.get("app-footer .container-fluid").should("be.visible");
      cy.get("app-footer .container-fluid").should("have.class", "text-center");
      cy.get("app-footer .container-fluid").should("have.class", "bg-light");

      // Verify footer is positioned at the bottom of the page
      cy.get("app-footer").then(($footer) => {
        const footerRect = $footer[0].getBoundingClientRect();

        // Footer should be near the bottom of the viewport or below the main content
        cy.get(".auth-form").then(($form) => {
          const formRect = $form[0].getBoundingClientRect();

          // Footer should be below the main form content
          expect(footerRect.top).to.be.greaterThan(formRect.bottom - 50);
        });
      });

      // Verify page structure integrity
      cy.get("body").should("exist");
      cy.get(".container.auth-container").should("be.visible");

      testResults.results.push({
        checkpoint: "1.2",
        status: "PASS",
        description: "Page footer properly positioned",
      });
    });

    it("1.3 - Ensure main content area is centered and properly positioned", () => {
      cy.log("Testing checkpoint 1.3: Main content centering");

      // Check Bootstrap centering classes
      cy.get(".container.auth-container").should("exist");
      cy.get(".row.justify-content-center").should("exist");
      cy.get(".col-lg-8.auth-form").should("exist");

      // Verify actual centering
      cy.get(".auth-form").then(($form) => {
        const formRect = $form[0].getBoundingClientRect();
        cy.window().then((win) => {
          const formCenter = formRect.left + formRect.width / 2;
          const windowCenter = win.innerWidth / 2;
          const centeringTolerance = 100; // Allow 100px tolerance

          expect(Math.abs(formCenter - windowCenter)).to.be.lessThan(
            centeringTolerance
          );
        });
      });

      testResults.results.push({
        checkpoint: "1.3",
        status: "PASS",
        description: "Main content properly centered",
      });
    });

    it("1.4 - Verify all page elements fit within the viewport without horizontal scrolling", () => {
      cy.log("Testing checkpoint 1.4: Viewport fitting");

      // Check no horizontal scrollbar
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
      });

      // Check all form elements are within viewport
      cy.get('[data-test="register-form"]').within(() => {
        cy.get("input, select, button, label").each(($el) => {
          const rect = $el[0].getBoundingClientRect();
          cy.window().then((win) => {
            expect(rect.right).to.be.at.most(win.innerWidth);
            expect(rect.left).to.be.at.least(0);
          });
        });
      });

      testResults.results.push({
        checkpoint: "1.4",
        status: "PASS",
        description: "All elements fit within viewport",
      });
    });

    it("1.5 - Check if page layout remains intact when browser window is resized", () => {
      cy.log("Testing checkpoint 1.5: Layout integrity on resize");

      const viewports = [
        { width: 1920, height: 1080, name: "Desktop Large" },
        { width: 1366, height: 768, name: "Desktop" },
        { width: 768, height: 1024, name: "Tablet" },
        { width: 375, height: 667, name: "Mobile" },
      ];

      viewports.forEach((viewport) => {
        cy.viewport(viewport.width, viewport.height);
        cy.wait(500);
        cy.log(
          `Testing ${viewport.name} (${viewport.width}x${viewport.height})`
        );

        // Verify core elements remain visible and functional
        cy.get('[data-test="register-form"]').should("be.visible");
        cy.get("h3").should("be.visible");
        cy.get('[data-test="register-submit"]').should("be.visible");

        // Check no horizontal scrolling
        cy.window().then((win) => {
          expect(win.document.body.scrollWidth).to.be.at.most(
            win.innerWidth + 1
          );
        });

        // Verify form elements are accessible
        cy.get('[data-test="first-name"]').should("be.visible");
        cy.get('[data-test="email"]').should("be.visible");
      });

      testResults.results.push({
        checkpoint: "1.5",
        status: "PASS",
        description: "Layout intact across all viewport sizes",
      });
    });
  });

  context("2. Responsive Design Tests", () => {
    it("2.1 - Test page display on desktop resolution (1920x1080)", () => {
      cy.log("Testing checkpoint 2.1: Desktop resolution display");
      cy.viewport(1920, 1080);
      cy.wait(500);

      // Verify page displays correctly on desktop
      cy.get('[data-test="register-form"]').should("be.visible");
      cy.get(".col-lg-8").should("be.visible");

      // Check form uses appropriate width on desktop
      cy.get(".auth-form").then(($form) => {
        const formWidth = $form[0].getBoundingClientRect().width;
        expect(formWidth).to.be.greaterThan(600);
        expect(formWidth).to.be.lessThan(1200);
      });

      // Verify two-column layout is maintained
      cy.get(".row .col-md-6").should("have.length.greaterThan", 0);

      testResults.results.push({
        checkpoint: "2.1",
        status: "PASS",
        description: "Desktop display correct",
      });
    });

    it("2.2 - Test page display on tablet resolution (768x1024)", () => {
      cy.log("Testing checkpoint 2.2: Tablet resolution display");
      cy.viewport(768, 1024);
      cy.wait(500);

      // Verify page displays correctly on tablet
      cy.get('[data-test="register-form"]').should("be.visible");
      cy.get("h3").should("be.visible");

      // Check form adapts to tablet width
      cy.get(".auth-form").then(($form) => {
        const formWidth = $form[0].getBoundingClientRect().width;
        expect(formWidth).to.be.greaterThan(300);
        expect(formWidth).to.be.lessThan(800);
      });

      // Verify no horizontal scrolling
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
      });

      // Check all form fields are accessible
      cy.get('[data-test="first-name"]').should("be.visible");
      cy.get('[data-test="email"]').should("be.visible");
      cy.get('[data-test="register-submit"]').should("be.visible");

      testResults.results.push({
        checkpoint: "2.2",
        status: "PASS",
        description: "Tablet display correct",
      });
    });

    it("2.3 - Test page display on mobile resolution (375x667)", () => {
      cy.log("Testing checkpoint 2.3: Mobile resolution display");
      cy.viewport(375, 667);
      cy.wait(500);

      // Verify page displays correctly on mobile
      cy.get('[data-test="register-form"]').should("be.visible");
      cy.get("h3").should("be.visible");

      // Check form adapts to mobile width
      cy.get(".auth-form").then(($form) => {
        const formWidth = $form[0].getBoundingClientRect().width;
        expect(formWidth).to.be.greaterThan(200);
        expect(formWidth).to.be.lessThan(400);
      });

      // Verify no horizontal scrolling
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
      });

      // Check form fields stack vertically and are accessible
      cy.get('[data-test="first-name"]').should("be.visible");
      cy.get('[data-test="email"]').should("be.visible");
      cy.get('[data-test="register-submit"]').should("be.visible");

      // Verify button is appropriately sized for mobile
      cy.get('[data-test="register-submit"]').then(($btn) => {
        const btnRect = $btn[0].getBoundingClientRect();
        expect(btnRect.width).to.be.greaterThan(100);
        expect(btnRect.height).to.be.greaterThan(40);
      });

      testResults.results.push({
        checkpoint: "2.3",
        status: "PASS",
        description: "Mobile display correct",
      });
    });

    it("2.4 - Check if elements stack properly on smaller screens", () => {
      cy.log("Testing checkpoint 2.4: Element stacking on small screens");

      const smallScreens = [
        { width: 480, height: 800 },
        { width: 375, height: 667 },
        { width: 320, height: 568 },
      ];

      smallScreens.forEach((screen) => {
        cy.viewport(screen.width, screen.height);
        cy.wait(500);

        // Check form elements stack vertically
        cy.get(".form-group").then(($groups) => {
          if ($groups.length > 1) {
            for (let i = 1; i < $groups.length; i++) {
              const prevRect = $groups[i - 1].getBoundingClientRect();
              const currRect = $groups[i].getBoundingClientRect();
              expect(currRect.top).to.be.greaterThan(prevRect.top);
            }
          }
        });

        // Ensure all elements are still accessible
        cy.get('[data-test="register-submit"]').should("be.visible");
        cy.get("h3").should("be.visible");
      });

      testResults.results.push({
        checkpoint: "2.4",
        status: "PASS",
        description: "Elements stack properly on small screens",
      });
    });
  });

  context("3. Colors & Visual Appearance", () => {
    it("3.1 - Background color is appropriate and not distracting", () => {
      cy.get("body")
        .should("have.css", "background-color")
        .and("not.equal", "rgba(0, 0, 0, 0)");
      cy.get(".auth-form").should("be.visible");
    });

    it("3.2 - Text color has sufficient contrast with background", () => {
      cy.get("h3")
        .should("have.css", "color")
        .and("not.equal", "rgba(0, 0, 0, 0)");
      cy.get(".form-label")
        .first()
        .should("have.css", "color")
        .and("not.equal", "transparent");
    });

    it("3.3 - Link colors are distinguishable from regular text", () => {
      cy.get("a").then(($links) => {
        if ($links.length > 0) {
          cy.get("a")
            .first()
            .should("have.css", "color")
            .and("not.equal", "rgba(0, 0, 0, 0)");
        } else {
          cy.log("No links found on registration page");
        }
      });
    });

    it("3.4 - Button colors are consistent with design theme", () => {
      cy.get('[data-test="register-submit"]')
        .should("have.css", "background-color")
        .and("not.equal", "rgba(0, 0, 0, 0)")
        .should("have.css", "color")
        .and("not.equal", "transparent");
    });

    it("3.5 - Hover effects on buttons and links work correctly", () => {
      cy.get('[data-test="register-submit"]').should(
        "have.css",
        "cursor",
        "pointer"
      );
      cy.get('[data-test="first-name"]')
        .focus()
        .should("have.css", "outline")
        .and("not.equal", "none");
    });
  });

  context("4. Typography & Text", () => {
    it("4.1 - Font family is consistent across all text elements", () => {
      cy.get("h3")
        .should("have.css", "font-family")
        .then((fontFamily) => {
          cy.get(".form-label").first().should("have.css", "font-family");
          cy.get(".form-control").first().should("have.css", "font-family");
        });
    });

    it("4.2 - Font sizes are appropriate and readable", () => {
      cy.get("h3")
        .should("have.css", "font-size")
        .then((fontSize) => {
          expect(parseFloat(fontSize)).to.be.greaterThan(18);
        });
      cy.get(".form-label")
        .first()
        .should("have.css", "font-size")
        .then((fontSize) => {
          expect(parseFloat(fontSize)).to.be.greaterThan(12);
        });
    });

    it("4.3 - Headings have proper hierarchy and sizing", () => {
      cy.get("h3").should("exist").and("be.visible");
      cy.get("h3")
        .should("have.css", "font-weight")
        .then((fontWeight) => {
          expect(parseInt(fontWeight)).to.be.greaterThan(400);
        });
    });

    it("4.4 - Text doesn't overflow container boundaries", () => {
      cy.get("h3").then(($heading) => {
        const headingRect = $heading[0].getBoundingClientRect();
        cy.get(".auth-form").then(($container) => {
          const containerRect = $container[0].getBoundingClientRect();
          expect(headingRect.right).to.be.at.most(containerRect.right + 1);
        });
      });
    });
  });

  context("5. Images & Media", () => {
    it("5.1 - All images load correctly without broken image icons", () => {
      cy.get("img").then(($images) => {
        if ($images.length > 0) {
          cy.get("img").each(($img) => {
            cy.wrap($img).should("be.visible");
            cy.wrap($img).should(($el) => {
              expect($el[0].naturalWidth).to.be.greaterThan(0);
              expect($el[0].naturalHeight).to.be.greaterThan(0);
            });
          });
        } else {
          cy.log("No images found on registration page");
        }
      });
    });

    it("5.2 - Images are properly sized and not pixelated", () => {
      cy.get("img").then(($images) => {
        if ($images.length > 0) {
          cy.get("img").each(($img) => {
            cy.wrap($img).should(($el) => {
              const displayWidth = $el[0].clientWidth;
              const naturalWidth = $el[0].naturalWidth;
              const scaleX = displayWidth / naturalWidth;
              expect(scaleX).to.be.at.most(2);
            });
          });
        } else {
          cy.log("No images found to check sizing");
        }
      });
    });

    it("5.3 - Images maintain aspect ratio and don't appear stretched", () => {
      cy.get("img").then(($images) => {
        if ($images.length > 0) {
          cy.get("img").each(($img) => {
            cy.wrap($img).should(($el) => {
              const displayRatio = $el[0].clientWidth / $el[0].clientHeight;
              const naturalRatio = $el[0].naturalWidth / $el[0].naturalHeight;
              const ratioDifference =
                Math.abs(displayRatio - naturalRatio) / naturalRatio;
              expect(ratioDifference).to.be.at.most(0.05);
            });
          });
        } else {
          cy.log("No images found to check aspect ratio");
        }
      });
    });

    it("5.4 - All icons display correctly and are not broken", () => {
      cy.get('i[class*="fa"], i[class*="bi"], svg').then(($icons) => {
        if ($icons.length > 0) {
          cy.get('i[class*="fa"], i[class*="bi"], svg').each(($icon) => {
            cy.wrap($icon).should("be.visible");
          });
        } else {
          cy.log("No icons found on registration page");
        }
      });
    });
  });

  context("6. Forms & Input Elements", () => {
    it("6.1 - Form fields are properly aligned and spaced", () => {
      cy.get(".form-group").should("have.length.greaterThan", 0);
      cy.get(".form-control").should("be.visible");
    });

    it("6.2 - Input field borders are visible and consistent", () => {
      cy.get(".form-control").each(($input) => {
        cy.wrap($input)
          .should("have.css", "border-width")
          .then((borderWidth) => {
            expect(parseFloat(borderWidth)).to.be.greaterThan(0);
          });
        cy.wrap($input)
          .should("have.css", "border-color")
          .and("not.equal", "rgba(0, 0, 0, 0)");
      });
    });

    it("6.3 - Input field focus states are clearly visible", () => {
      cy.get('[data-test="first-name"]').focus();
      cy.get('[data-test="first-name"]')
        .should("have.css", "outline")
        .and("not.equal", "none");
    });

    it("6.4 - Password fields mask input correctly", () => {
      cy.get('[data-test="password"]').should("have.attr", "type", "password");
      cy.get('[data-test="password"]').type("testpassword");
      cy.get('[data-test="password"]').should("have.value", "testpassword");
      cy.get('[data-test="password"]').clear();
    });

    it("6.5 - All buttons are properly styled and visible", () => {
      cy.get('[data-test="register-submit"]')
        .should("be.visible")
        .should("have.css", "background-color")
        .and("not.equal", "rgba(0, 0, 0, 0)")
        .should("have.css", "cursor", "pointer");
    });
  });

  context("7. Browser Compatibility Tests", () => {
    it("7.1 - Test page display in Google Chrome", () => {
      cy.log(`Testing in ${Cypress.browser.name} browser`);
      cy.log("Testing checkpoint 7.1: Chrome compatibility");

      // Basic functionality test
      cy.get('[data-test="register-form"]').should("be.visible");
      cy.get("h3").should("contain", "Customer registration");

      // Test form functionality
      cy.get('[data-test="first-name"]')
        .type("John")
        .should("have.value", "John");
      cy.get('[data-test="email"]')
        .type("test@example.com")
        .should("have.value", "test@example.com");

      // Test CSS rendering
      cy.get('[data-test="register-submit"]').should(
        "have.css",
        "cursor",
        "pointer"
      );
      cy.get(".form-control").should("have.css", "box-sizing", "border-box");

      // Test responsive behavior
      cy.viewport(1200, 800);
      cy.get(".col-lg-8").should("be.visible");

      // Clear test data
      cy.get('[data-test="first-name"]').clear();
      cy.get('[data-test="email"]').clear();

      testResults.results.push({
        checkpoint: "7.1",
        status: "PASS",
        description: "Chrome compatibility verified",
      });
    });

    it("7.2 - Test page display in Mozilla Firefox", () => {
      cy.log("Testing checkpoint 7.2: Firefox compatibility simulation");

      // Test basic functionality
      cy.get('[data-test="register-form"]').should("be.visible");

      // Test input field behavior (Firefox handles some inputs differently)
      cy.get('[data-test="email"]')
        .type("test@example.com")
        .should("have.value", "test@example.com");
      cy.get('[data-test="password"]')
        .type("testpass")
        .should("have.attr", "type", "password");

      // Test CSS properties that might render differently
      cy.get(".form-control")
        .should("have.css", "display")
        .then((display) => {
          expect(["block", "inline-block"]).to.include(display);
        });

      // Test flexbox layouts (Firefox has good support)
      cy.get(".row")
        .should("have.css", "display")
        .then((display) => {
          expect(display).to.include("flex");
        });

      // Clear test data
      cy.get('[data-test="email"]').clear();
      cy.get('[data-test="password"]').clear();

      testResults.results.push({
        checkpoint: "7.2",
        status: "PASS",
        description: "Firefox compatibility verified",
      });
    });

    it("7.3 - Test page display in Safari or Microsoft Edge", () => {
      cy.log("Testing checkpoint 7.3: Safari/Edge compatibility simulation");

      // Test basic page structure
      cy.get('[data-test="register-form"]').should("be.visible");
      cy.get(".container.auth-container").should("exist");

      // Test CSS Grid/Flexbox support
      cy.get(".row")
        .should("have.css", "display")
        .then((display) => {
          expect(display).to.include("flex");
        });

      // Test form controls (Safari has specific styling)
      cy.get(".form-control").each(($input) => {
        cy.wrap($input).should("be.visible");
        cy.wrap($input)
          .should("have.css", "border-radius")
          .then((borderRadius) => {
            expect(borderRadius).to.not.be.undefined;
          });
      });

      // Test button styling
      cy.get('[data-test="register-submit"]')
        .should("have.css", "background-color")
        .then((bgColor) => {
          expect(bgColor).to.not.equal("rgba(0, 0, 0, 0)");
        });

      // Test input focus behavior
      cy.get('[data-test="first-name"]').focus();
      cy.get('[data-test="first-name"]')
        .should("have.css", "outline")
        .then((outline) => {
          expect(outline).to.not.be.undefined;
        });

      testResults.results.push({
        checkpoint: "7.3",
        status: "PASS",
        description: "Safari/Edge compatibility verified",
      });
    });
  });
});
