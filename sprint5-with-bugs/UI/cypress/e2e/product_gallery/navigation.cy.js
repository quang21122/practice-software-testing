describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('1.4.1 - All links are clickable and functional', () => {
    cy.get('a[href*="#/"]').each(($link) => {
      cy.wrap($link).click();
      cy.url().should('include', $link.attr('href'));
    });
  });

  it('1.4.3 - External links open in new tabs', () => {
    cy.get('a[href^="http"]').should('have.attr', 'target', '_blank');
  });

  it('1.4.4 - Custom 404 page exists', () => {
    cy.visit('#/non-existent-page', { failOnStatusCode: false });
    cy.contains('404').should('exist');
  });
});
