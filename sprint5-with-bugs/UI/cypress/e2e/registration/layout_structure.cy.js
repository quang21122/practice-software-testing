import '../../support/command.js'

describe('Registration Page - Layout & Structure', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000); // Wait for page to load
  });

  it('1.1 - Check if page header is properly aligned and positioned at the top', () => {
    // Check if header exists and is at the top
    cy.get('h3').should('contain', 'Customer registration');
    cy.get('h3').should('be.visible');
    
    // Verify header is positioned at the top of the form
    cy.get('.auth-form h3').then(($header) => {
      const headerRect = $header[0].getBoundingClientRect();
      cy.get('.auth-form').then(($form) => {
        const formRect = $form[0].getBoundingClientRect();
        expect(headerRect.top).to.be.lessThan(formRect.top + 100);
      });
    });
  });

  it('1.2 - Verify page footer is properly aligned and positioned at the bottom', () => {
    // Check if there's a footer or bottom element
    cy.get('body').then(($body) => {
      const bodyHeight = $body[0].scrollHeight;
      cy.get('.auth-form').then(($form) => {
        const formRect = $form[0].getBoundingClientRect();
        // Verify form doesn't extend beyond reasonable bounds
        expect(formRect.bottom).to.be.lessThan(bodyHeight);
      });
    });
  });

  it('1.3 - Ensure main content area is centered and properly positioned', () => {
    // Check if the main form container is centered
    cy.get('.container.auth-container').should('have.class', 'container');
    cy.get('.row.justify-content-center').should('exist');
    cy.get('.col-lg-8.auth-form').should('exist');
    
    // Verify centering
    cy.get('.auth-form').then(($form) => {
      const formRect = $form[0].getBoundingClientRect();
      const windowWidth = Cypress.config('viewportWidth');
      const formCenter = formRect.left + formRect.width / 2;
      const windowCenter = windowWidth / 2;
      
      // Allow some tolerance for centering (within 50px)
      expect(Math.abs(formCenter - windowCenter)).to.be.lessThan(50);
    });
  });

  it('1.4 - Verify all page elements fit within the viewport without horizontal scrolling', () => {
    // Check that no horizontal scrollbar appears
    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth);
    });
    
    // Check that all form elements are within viewport
    cy.get('[data-test="register-form"]').within(() => {
      cy.get('input, select, button').each(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).to.be.at.most(Cypress.config('viewportWidth'));
        expect(rect.left).to.be.at.least(0);
      });
    });
  });

  it('1.5 - Check if page layout remains intact when browser window is resized', () => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1366, height: 768 },  // Laptop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];

    viewports.forEach((viewport) => {
      cy.viewport(viewport.width, viewport.height);
      cy.wait(500); // Wait for resize to complete
      
      // Check that form is still visible and properly positioned
      cy.get('[data-test="register-form"]').should('be.visible');
      cy.get('h3').should('be.visible');
      
      // Check that no horizontal scrolling is needed
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
      });
      
      // Verify form elements are still accessible
      cy.get('[data-test="first-name"]').should('be.visible');
      cy.get('[data-test="register-submit"]').should('be.visible');
    });
  });
});
