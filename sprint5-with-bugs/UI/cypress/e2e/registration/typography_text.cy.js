import '../../support/command.js'

describe('Registration Page - Typography & Text', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('4.1 - Verify font family is consistent across all text elements', () => {
    let baseFontFamily;
    
    // Get the base font family from the heading
    cy.get('h3').should('have.css', 'font-family').then((fontFamily) => {
      baseFontFamily = fontFamily;
      cy.log(`Base font family: ${baseFontFamily}`);
    });
    
    // Check labels have consistent font family
    cy.get('.form-label').each(($label) => {
      cy.wrap($label).should('have.css', 'font-family').then((fontFamily) => {
        // Allow for font fallbacks - check if main font is present
        const baseFont = baseFontFamily.split(',')[0].trim().replace(/['"]/g, '');
        expect(fontFamily).to.include(baseFont);
      });
    });
    
    // Check input fields have consistent font family
    cy.get('.form-control').each(($input) => {
      cy.wrap($input).should('have.css', 'font-family').then((fontFamily) => {
        const baseFont = baseFontFamily.split(',')[0].trim().replace(/['"]/g, '');
        expect(fontFamily).to.include(baseFont);
      });
    });
    
    // Check button font family
    cy.get('[data-test="register-submit"]').should('have.css', 'font-family').then((fontFamily) => {
      const baseFont = baseFontFamily.split(',')[0].trim().replace(/['"]/g, '');
      expect(fontFamily).to.include(baseFont);
    });
  });

  it('4.2 - Check if font sizes are appropriate and readable', () => {
    // Check heading font size
    cy.get('h3').should('have.css', 'font-size').then((fontSize) => {
      const size = parseFloat(fontSize);
      expect(size).to.be.greaterThan(18); // Minimum readable size for headings
      expect(size).to.be.lessThan(48);    // Not too large
    });
    
    // Check label font sizes
    cy.get('.form-label').each(($label) => {
      cy.wrap($label).should('have.css', 'font-size').then((fontSize) => {
        const size = parseFloat(fontSize);
        expect(size).to.be.greaterThan(12); // Minimum readable size
        expect(size).to.be.lessThan(24);    // Not too large for labels
      });
    });
    
    // Check input field font sizes
    cy.get('.form-control').each(($input) => {
      cy.wrap($input).should('have.css', 'font-size').then((fontSize) => {
        const size = parseFloat(fontSize);
        expect(size).to.be.greaterThan(12); // Minimum readable size
        expect(size).to.be.lessThan(20);    // Appropriate for input fields
      });
    });
    
    // Check button font size
    cy.get('[data-test="register-submit"]').should('have.css', 'font-size').then((fontSize) => {
      const size = parseFloat(fontSize);
      expect(size).to.be.greaterThan(12); // Minimum readable size
      expect(size).to.be.lessThan(24);    // Appropriate for buttons
    });
  });

  it('4.3 - Ensure headings (H1, H2, H3) have proper hierarchy and sizing', () => {
    // Check main heading (H3)
    cy.get('h3').should('exist').and('be.visible');
    cy.get('h3').should('have.css', 'font-size').then((h3Size) => {
      const h3FontSize = parseFloat(h3Size);
      
      // Check if there are other heading levels
      cy.get('h1, h2, h4, h5, h6').then(($headings) => {
        if ($headings.length > 0) {
          $headings.each((index, heading) => {
            const headingSize = parseFloat(getComputedStyle(heading).fontSize);
            const tagName = heading.tagName.toLowerCase();
            
            // Verify hierarchy: h1 > h2 > h3 > h4 > h5 > h6
            if (tagName === 'h1' || tagName === 'h2') {
              expect(headingSize).to.be.greaterThan(h3FontSize);
            } else if (tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
              expect(headingSize).to.be.lessThan(h3FontSize);
            }
          });
        }
      });
      
      // Check font weight for emphasis
      cy.get('h3').should('have.css', 'font-weight').then((fontWeight) => {
        const weight = parseInt(fontWeight);
        expect(weight).to.be.greaterThan(400); // Should be bold or semi-bold
      });
    });
  });

  it('4.4 - Ensure text doesn\'t overflow its container boundaries', () => {
    // Check heading doesn't overflow
    cy.get('h3').then(($heading) => {
      const headingRect = $heading[0].getBoundingClientRect();
      cy.get('.auth-form').then(($container) => {
        const containerRect = $container[0].getBoundingClientRect();
        expect(headingRect.right).to.be.at.most(containerRect.right + 1);
        expect(headingRect.left).to.be.at.least(containerRect.left - 1);
      });
    });
    
    // Check labels don't overflow
    cy.get('.form-label').each(($label) => {
      cy.wrap($label).then(($el) => {
        const labelRect = $el[0].getBoundingClientRect();
        cy.get('.form-group').first().then(($container) => {
          const containerRect = $container[0].getBoundingClientRect();
          expect(labelRect.right).to.be.at.most(containerRect.right + 1);
        });
      });
    });
    
    // Check button text doesn't overflow
    cy.get('[data-test="register-submit"]').then(($button) => {
      const buttonRect = $button[0].getBoundingClientRect();
      const buttonText = $button.text().trim();
      
      // Verify button has enough width for its text
      expect(buttonRect.width).to.be.greaterThan(buttonText.length * 6); // Rough estimate
      
      // Check text doesn't overflow button boundaries
      expect($button[0].scrollWidth).to.be.at.most($button[0].clientWidth + 1);
    });
    
    // Check error messages don't overflow
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    
    cy.get('[data-test="first-name-error"]').then(($error) => {
      if ($error.length > 0) {
        const errorRect = $error[0].getBoundingClientRect();
        cy.get('.form-group').first().then(($container) => {
          const containerRect = $container[0].getBoundingClientRect();
          expect(errorRect.right).to.be.at.most(containerRect.right + 10); // Small tolerance
        });
      }
    });
  });

  it('4.5 - Check text alignment and spacing', () => {
    // Check heading alignment
    cy.get('h3').should('have.css', 'text-align').then((alignment) => {
      expect(['left', 'center']).to.include(alignment);
    });
    
    // Check label alignment
    cy.get('.form-label').each(($label) => {
      cy.wrap($label).should('have.css', 'text-align').then((alignment) => {
        expect(['left', 'start']).to.include(alignment);
      });
    });
    
    // Check line height for readability
    cy.get('h3').should('have.css', 'line-height').then((lineHeight) => {
      const height = parseFloat(lineHeight);
      expect(height).to.be.greaterThan(1.2); // Minimum for readability
    });
    
    // Check letter spacing is not too tight or too loose
    cy.get('.form-label').first().should('have.css', 'letter-spacing').then((spacing) => {
      const spacingValue = parseFloat(spacing);
      expect(Math.abs(spacingValue)).to.be.lessThan(2); // Not too extreme
    });
  });

  it('4.6 - Verify placeholder text is readable and appropriate', () => {
    // Check placeholder text exists and is readable
    cy.get('[data-test="first-name"]').should('have.attr', 'placeholder').then((placeholder) => {
      expect(placeholder).to.not.be.empty;
      expect(placeholder.length).to.be.greaterThan(5); // Meaningful placeholder
    });
    
    cy.get('[data-test="email"]').should('have.attr', 'placeholder').then((placeholder) => {
      expect(placeholder).to.not.be.empty;
      expect(placeholder).to.include('@'); // Email placeholder should indicate format
    });
    
    // Check placeholder styling
    cy.get('[data-test="first-name"]').should('have.css', 'color').then((textColor) => {
      // Placeholder should be visible but distinguishable from actual text
      expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });
});
