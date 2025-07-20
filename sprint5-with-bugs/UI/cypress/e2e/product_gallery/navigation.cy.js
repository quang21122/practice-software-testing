describe("Check All Links on localhost:4200 Without Timeout", () => {
  beforeEach(() => {
    // Visit the page with increased timeout (30 seconds)
    cy.visit("http://localhost:4200", { timeout: 30000 });
  });

  it("should verify all links are clickable and functional", () => {
    // Increase command timeout for finding links (20 seconds)
    cy.get("a[href]", { timeout: 20000 }).each(($link) => {
      const href = $link.prop("href");
      const text = $link.text().trim() || "Unnamed Link";

      // Ensure the link is visible and not disabled
      cy.wrap($link, { timeout: 10000 })
        .should("be.visible")
        .and("not.have.attr", "disabled");

      // Skip non-HTTP links (e.g., mailto, tel)
      if (!href.startsWith("http")) {
        cy.log(`Skipping non-HTTP link: ${text} (${href})`);
        return;
      }

      // Click the link with force option and timeout
      cy.wrap($link, { timeout: 10000 }).click({ force: true });

      // Verify the link's response status with increased timeout (15 seconds)
      cy.request({
        url: href,
        failOnStatusCode: false,
        timeout: 15000,
      }).then((response) => {
        cy.log(`Link: ${text} (${href}) - Status: ${response.status}`);
        expect(response.status).to.eq(
          200,
          `Link ${text} (${href}) should return 200`
        );
      });

      // Navigate back with timeout (10 seconds)
      cy.go("back", { timeout: 10000 });
    });
  });
});
