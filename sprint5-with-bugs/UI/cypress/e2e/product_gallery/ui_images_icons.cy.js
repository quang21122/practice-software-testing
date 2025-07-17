describe('UI Images and Icons', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('1.3.1 - Images display clearly', () => {
    cy.percySnapshot('Product Images - Clarity');
  });

  it('1.3.2 - Images are aligned properly', () => {
    cy.get('.card img').each(($img) => {
      const imgRect = $img[0].getBoundingClientRect();
      cy.wrap($img).parents('.product-card').then(($card) => {
        const cardRect = $card[0].getBoundingClientRect();
        expect(imgRect.left).to.be.at.least(cardRect.left);
        expect(imgRect.right).to.be.at.most(cardRect.right);
      });
    });
  });

  it('1.3.4 - Images have alt text', () => {
    cy.get('img').each(($img) => {
      expect($img).to.have.attr('alt').and.not.be.empty;
    });
  });
});
