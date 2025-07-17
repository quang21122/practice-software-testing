describe('UI Colors and Fonts', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('1.2.1 - Text has sufficient contrast with background', () => {
    cy.injectAxe();
    cy.checkA11y(); // Using cypress-axe for WCAG contrast checks
  });

  /*it('1.2.2 - Colors are consistent across the system', () => {
    cy.get('.card-title').should('have.css', 'color', 'rgb(0, 0, 0)'); // Example color
    cy.get('[data-test="filters"] h3').should('have.css', 'color', 'rgb(0, 0, 0)');
  });*/

  it('1.2.3 - Hover links change color appropriately', () => {
    cy.get('a').first().then(($link) => {
      const originalColor = $link.css('color');
      cy.wrap($link).trigger('mouseover');
      cy.wrap($link).should('not.have.css', 'color', originalColor);
    });
  });

  /* it('1.2.4 - Fonts are consistent across screens', () => {
    cy.get('h1, h2, h3, p').should('have.css', 'font-family', 'Arial, sans-serif'); // Example font
  });
  */
});
