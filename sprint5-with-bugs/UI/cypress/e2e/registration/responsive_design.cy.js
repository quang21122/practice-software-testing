import '../../support/command.js'

describe('Registration Page - Responsive Design', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('2.1 - Test page display on desktop resolution (1920x1080)', () => {
    cy.viewport(1920, 1080);
    cy.wait(500);
    
    // Verify page displays correctly on desktop
    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('.col-lg-8').should('be.visible');
    
    // Check that form uses appropriate width on desktop
    cy.get('.auth-form').then(($form) => {
      const formWidth = $form[0].getBoundingClientRect().width;
      expect(formWidth).to.be.greaterThan(600); // Should be reasonably wide on desktop
      expect(formWidth).to.be.lessThan(1200); // But not too wide
    });
    
    // Verify two-column layout is maintained
    cy.get('.row').within(() => {
      cy.get('.col-md-6').should('have.length.greaterThan', 0);
    });
  });

  it('2.2 - Test page display on tablet resolution (768x1024)', () => {
    cy.viewport(768, 1024);
    cy.wait(500);
    
    // Verify page displays correctly on tablet
    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('h3').should('be.visible');
    
    // Check that form adapts to tablet width
    cy.get('.auth-form').then(($form) => {
      const formWidth = $form[0].getBoundingClientRect().width;
      expect(formWidth).to.be.greaterThan(300);
      expect(formWidth).to.be.lessThan(800);
    });
    
    // Verify no horizontal scrolling
    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
    });
    
    // Check that all form fields are accessible
    cy.get('[data-test="first-name"]').should('be.visible');
    cy.get('[data-test="email"]').should('be.visible');
    cy.get('[data-test="register-submit"]').should('be.visible');
  });

  it('2.3 - Test page display on mobile resolution (375x667)', () => {
    cy.viewport(375, 667);
    cy.wait(500);
    
    // Verify page displays correctly on mobile
    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('h3').should('be.visible');
    
    // Check that form adapts to mobile width
    cy.get('.auth-form').then(($form) => {
      const formWidth = $form[0].getBoundingClientRect().width;
      expect(formWidth).to.be.greaterThan(200);
      expect(formWidth).to.be.lessThan(400);
    });
    
    // Verify no horizontal scrolling
    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
    });
    
    // Check that form fields stack vertically and are accessible
    cy.get('[data-test="first-name"]').should('be.visible');
    cy.get('[data-test="email"]').should('be.visible');
    cy.get('[data-test="register-submit"]').should('be.visible');
    
    // Verify button is appropriately sized for mobile
    cy.get('[data-test="register-submit"]').then(($btn) => {
      const btnRect = $btn[0].getBoundingClientRect();
      expect(btnRect.width).to.be.greaterThan(100); // Minimum touch target
      expect(btnRect.height).to.be.greaterThan(40);  // Minimum touch target
    });
  });

  it('2.4 - Check if elements stack properly on smaller screens', () => {
    // Test various small screen sizes
    const smallScreens = [
      { width: 480, height: 800 },
      { width: 375, height: 667 },
      { width: 320, height: 568 }
    ];

    smallScreens.forEach((screen) => {
      cy.viewport(screen.width, screen.height);
      cy.wait(500);
      
      // Check that form elements stack vertically
      cy.get('.form-group').then(($groups) => {
        if ($groups.length > 1) {
          for (let i = 1; i < $groups.length; i++) {
            const prevRect = $groups[i-1].getBoundingClientRect();
            const currRect = $groups[i].getBoundingClientRect();
            
            // Current element should be below the previous one
            expect(currRect.top).to.be.greaterThan(prevRect.top);
          }
        }
      });
      
      // Verify that columns stack on small screens
      cy.get('.col-md-6').then(($cols) => {
        if ($cols.length > 1) {
          const firstColRect = $cols[0].getBoundingClientRect();
          const secondColRect = $cols[1].getBoundingClientRect();
          
          // On small screens, second column should be below first
          if (screen.width < 768) {
            expect(secondColRect.top).to.be.greaterThan(firstColRect.bottom - 10);
          }
        }
      });
      
      // Ensure all elements are still accessible
      cy.get('[data-test="register-submit"]').should('be.visible');
      cy.get('h3').should('be.visible');
    });
  });
});
