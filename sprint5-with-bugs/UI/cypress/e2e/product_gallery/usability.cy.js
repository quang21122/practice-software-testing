describe('Usability', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('2.1.1 - Homepage link exists on every page', () => {
    cy.get('a[href="/"]').should('exist');
  });

  /*
  it('2.1.2 - Breadcrumbs show user location', () => {
    cy.get('.breadcrumb').should('exist').and('contain', 'Home');
  });
  */

  it('2.1.6 - First form field is auto-focused', () => {
    cy.visit('localhost:4200/#/contact');
    cy.get('.auth-form .form-control').first().should('have.focus');
  });

  /* it('2.2.7 - Loading indicator appears for slow loads', () => {
    cy.intercept('GET', '/api/data', { delay: 3000 }).as('getData');
    cy.get('#load-data').click();
    cy.get('.loading-indicator').should('be.visible');
    cy.wait('@getData');
    cy.get('.loading-indicator').should('not.exist');
  });
  */

  it('2.2.13 - Layout does not break on resize', () => {
    cy.viewport('iphone-6');
    cy.percySnapshot('Mobile Layout');
  });
});
