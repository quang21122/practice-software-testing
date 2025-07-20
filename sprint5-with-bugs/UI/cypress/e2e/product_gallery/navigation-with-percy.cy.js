describe("Responsive Design Tests", () => {
  // Define viewports for testing
  const viewports = [
    { name: "desktop", width: 1920, height: 1080 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ];

  // Define browsers for cross-browser testing (configured in cypress.config.js)
  const browsers = ["chrome", "firefox", "edge"];

  // 4.1: Test layout adaptation across different screen sizes
  viewports.forEach((viewport) => {
    it(`4.1: Should adapt layout correctly on ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");

      // Verify main container is visible and has appropriate width
      cy.get("body").should("be.visible");
      cy.get("main")
        .should("be.visible")
        .and("have.css", "width")
        .and("match", /px|%/);

      // Check if key elements are properly aligned
      cy.get("header").should("be.visible").and("have.css", "display");
      cy.get("footer").should("be.visible").and("have.css", "display");
    });
  });

  // 4.2: Test UI elements visibility and usability on smaller screens
  viewports.forEach((viewport) => {
    it(`4.2: Should have visible and usable UI elements on ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");

      // Test buttons
      cy.get("button").each(($btn) => {
        cy.wrap($btn)
          .should("be.visible")
          .and("have.css", "display")
          .and("not.equal", "none")
          .click({ force: true })
          .should("not.be.disabled");
      });

      // Test form elements
      cy.get("input, textarea, select").each(($input) => {
        cy.wrap($input)
          .should("be.visible")
          .and("have.css", "display")
          .and("not.equal", "none")
          .and("not.be.disabled");
      });
    });
  });

  // 4.3: Test navigation menu collapse on mobile
  it("4.3: Should collapse navigation into functional hamburger menu on mobile", () => {
    cy.viewport("iphone-6"); // 375x667
    cy.visit("/");

    // Check if hamburger menu is visible
    cy.get('.hamburger-menu, .menu-toggle, [aria-label="Toggle navigation"]')
      .should("be.visible")
      .and("have.css", "display")
      .and("not.equal", "none");

    // Check if regular nav is hidden
    cy.get("nav")
      .should("have.css", "display")
      .and("match", /none|hidden/);

    // Click hamburger menu and verify menu items
    cy.get(
      '.hamburger-menu, .menu-toggle, [aria-label="Toggle navigation"]'
    ).click({ force: true });

    cy.get("nav")
      .should("be.visible")
      .find("a")
      .should("have.length.greaterThan", 0)
      .each(($link) => {
        cy.wrap($link)
          .should("be.visible")
          .and("have.attr", "href")
          .and("not.be.empty");
      });
  });

  // 4.4: Test cross-browser rendering
  browsers.forEach((browser) => {
    it(`4.4: Should render correctly on ${browser}`, () => {
      cy.visit("/", {
        // Browser is set in cypress.config.js, this is for reference
        browser: browser,
      });

      // Verify key elements are present and visible
      cy.get("header").should("be.visible");
      cy.get("main").should("be.visible");
      cy.get("footer").should("be.visible");

      // Check for basic layout integrity
      cy.get("body").should("have.css", "display").and("not.equal", "none");

      // Take screenshot for visual regression (optional)
      cy.screenshot(`render-test-${browser}`, { capture: "viewport" });
    });
  });

  // 4.5: Test for unwanted horizontal scrolling
  viewports.forEach((viewport) => {
    it(`4.5: Should not have horizontal scrolling on ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");

      // Check if body width does not exceed viewport width
      cy.get("body").then(($body) => {
        const bodyWidth = $body[0].scrollWidth;
        const viewportWidth = viewport.width;
        expect(bodyWidth).to.be.lte(viewportWidth);
      });

      // Check if window.scrollX is 0
      cy.window().then((win) => {
        expect(win.scrollX).to.equal(0);
      });

      // Verify no horizontal scrollbar
      cy.get("html").then(($html) => {
        const hasHorizontalScroll = $html[0].scrollWidth > $html[0].clientWidth;
        expect(hasHorizontalScroll).to.be.false;
      });
    });
  });
});
