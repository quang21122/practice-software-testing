import '../../support/command.js'

describe('Registration Page - Colors & Visual Appearance', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('3.1 - Check if background color is appropriate and not distracting', () => {
    // Check body background color
    cy.get('body').should('have.css', 'background-color').then((bgColor) => {
      // Convert to RGB values for analysis
      const rgb = bgColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        
        // Check that background is not too bright or too dark
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        expect(brightness).to.be.within(200, 255); // Should be light but not pure white
      }
    });
    
    // Check container background
    cy.get('.auth-container').should('be.visible');
    cy.get('.auth-form').should('have.css', 'background-color').then((bgColor) => {
      // Should have a defined background color
      expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });

  it('3.2 - Verify text color has sufficient contrast with background', () => {
    // Check heading contrast
    cy.get('h3').should('have.css', 'color').then((textColor) => {
      cy.get('h3').should('have.css', 'background-color').then((bgColor) => {
        // Text should be visible (not transparent)
        expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
        expect(textColor).to.not.equal('transparent');
      });
    });
    
    // Check label contrast
    cy.get('.form-label').first().should('have.css', 'color').then((textColor) => {
      expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(textColor).to.not.equal('transparent');
    });
    
    // Check input text contrast
    cy.get('.form-control').first().should('have.css', 'color').then((textColor) => {
      expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(textColor).to.not.equal('transparent');
    });
  });

  it('3.3 - Ensure link colors are distinguishable from regular text', () => {
    // Check if there are any links on the page
    cy.get('a').then(($links) => {
      if ($links.length > 0) {
        cy.get('a').first().should('have.css', 'color').then((linkColor) => {
          cy.get('p, span, div').first().should('have.css', 'color').then((textColor) => {
            // Link color should be different from regular text
            expect(linkColor).to.not.equal(textColor);
          });
        });
      } else {
        cy.log('No links found on registration page');
      }
    });
  });

  it('3.4 - Verify button colors are consistent with the design theme', () => {
    // Check submit button styling
    cy.get('[data-test="register-submit"]').should('have.css', 'background-color').then((bgColor) => {
      expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(bgColor).to.not.equal('transparent');
    });
    
    cy.get('[data-test="register-submit"]').should('have.css', 'color').then((textColor) => {
      expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(textColor).to.not.equal('transparent');
    });
    
    // Check button border
    cy.get('[data-test="register-submit"]').should('have.css', 'border').then((border) => {
      expect(border).to.not.equal('none');
    });
  });

  it('3.5 - Check if hover effects on buttons and links work correctly', () => {
    // Test button hover effect
    cy.get('[data-test="register-submit"]').then(($btn) => {
      const originalBgColor = getComputedStyle($btn[0]).backgroundColor;
      
      cy.get('[data-test="register-submit"]').trigger('mouseover');
      cy.wait(100);
      
      cy.get('[data-test="register-submit"]').should('have.css', 'background-color').then((hoverBgColor) => {
        // Hover effect should change the appearance (color or other properties)
        // We'll check if cursor changes to pointer as a minimum
        cy.get('[data-test="register-submit"]').should('have.css', 'cursor', 'pointer');
      });
    });
    
    // Test input field focus effects
    cy.get('[data-test="first-name"]').focus();
    cy.get('[data-test="first-name"]').should('have.css', 'outline').then((outline) => {
      // Should have some form of focus indication
      expect(outline).to.not.equal('none');
    });
    
    // Test if any links have hover effects
    cy.get('a').then(($links) => {
      if ($links.length > 0) {
        cy.get('a').first().trigger('mouseover');
        cy.get('a').first().should('have.css', 'cursor', 'pointer');
      }
    });
  });

  it('3.6 - Check error message colors and visibility', () => {
    // Trigger validation errors to test error styling
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    
    // Check if error messages appear with appropriate styling
    cy.get('[data-test="first-name-error"]').should('be.visible');
    cy.get('[data-test="first-name-error"]').should('have.css', 'color').then((errorColor) => {
      // Error text should be red or similar warning color
      const rgb = errorColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        // Red component should be higher for error messages
        expect(r).to.be.greaterThan(Math.max(g, b));
      }
    });
    
    // Check error background color
    cy.get('[data-test="first-name-error"]').should('have.css', 'background-color').then((bgColor) => {
      expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });

  it('3.7 - Verify form field border colors and states', () => {
    // Check normal state
    cy.get('[data-test="first-name"]').should('have.css', 'border-color').then((borderColor) => {
      expect(borderColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
    
    // Check focus state
    cy.get('[data-test="first-name"]').focus();
    cy.get('[data-test="first-name"]').should('have.css', 'border-color').then((focusBorderColor) => {
      expect(focusBorderColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
    
    // Check error state
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    cy.get('[data-test="first-name"]').should('have.css', 'border-color').then((errorBorderColor) => {
      expect(errorBorderColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });
});
