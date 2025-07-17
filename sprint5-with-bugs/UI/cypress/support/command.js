Cypress.Commands.add('shouldNotOverflowCardBody', () => {
  cy.get('.card-body').each(($body) => {
    cy.wrap($body).within(() => {
      cy.get('.card-title').then(($title) => {
        const titleEl = $title[0];
        const bodyEl = $body[0];
        const titleRect = titleEl.getBoundingClientRect();
        const bodyRect = bodyEl.getBoundingClientRect();
        expect(titleRect.left).to.be.at.least(bodyRect.left, 'Title overflows left');
        expect(titleRect.right).to.be.at.most(bodyRect.right, 'Title overflows right');
        expect(titleRect.top).to.be.at.least(bodyRect.top, 'Title overflows top');
        expect(titleRect.bottom).to.be.at.most(bodyRect.bottom, 'Title overflows bottom');
        const isTextOverflowing =
          titleEl.scrollWidth > titleEl.clientWidth || titleEl.scrollHeight > titleEl.clientHeight;
        expect(isTextOverflowing).to.be.false;
      });
    });
  });
});
