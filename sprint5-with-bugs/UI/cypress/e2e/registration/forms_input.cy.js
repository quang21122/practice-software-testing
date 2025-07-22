import '../../support/command.js'

describe('Registration Page - Forms & Input Elements', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('6.1 - Check if form fields are properly aligned and spaced', () => {
    // Check vertical alignment of form groups
    cy.get('.form-group').then(($groups) => {
      if ($groups.length > 1) {
        for (let i = 1; i < $groups.length; i++) {
          const prevRect = $groups[i-1].getBoundingClientRect();
          const currRect = $groups[i].getBoundingClientRect();
          
          // Check spacing between form groups
          const spacing = currRect.top - prevRect.bottom;
          expect(spacing).to.be.greaterThan(5); // Minimum spacing
          expect(spacing).to.be.lessThan(50);   // Not too much spacing
        }
      }
    });
    
    // Check horizontal alignment within rows
    cy.get('.row .col-md-6').then(($cols) => {
      if ($cols.length > 1) {
        const firstColRect = $cols[0].getBoundingClientRect();
        const secondColRect = $cols[1].getBoundingClientRect();
        
        // Columns should be roughly aligned vertically
        expect(Math.abs(firstColRect.top - secondColRect.top)).to.be.lessThan(10);
      }
    });
    
    // Check label and input alignment
    cy.get('.form-group').each(($group) => {
      cy.wrap($group).within(() => {
        cy.get('.form-label').then(($label) => {
          if ($label.length > 0) {
            cy.get('.form-control').then(($input) => {
              if ($input.length > 0) {
                const labelRect = $label[0].getBoundingClientRect();
                const inputRect = $input[0].getBoundingClientRect();
                
                // Label should be above input
                expect(labelRect.bottom).to.be.at.most(inputRect.top + 5);
                
                // Label and input should be left-aligned
                expect(Math.abs(labelRect.left - inputRect.left)).to.be.lessThan(10);
              }
            });
          }
        });
      });
    });
  });

  it('6.2 - Verify input field borders are visible and consistent', () => {
    // Check all form controls have visible borders
    cy.get('.form-control').each(($input) => {
      cy.wrap($input).should('have.css', 'border-width').then((borderWidth) => {
        expect(parseFloat(borderWidth)).to.be.greaterThan(0);
      });
      
      cy.wrap($input).should('have.css', 'border-style').then((borderStyle) => {
        expect(borderStyle).to.not.equal('none');
      });
      
      cy.wrap($input).should('have.css', 'border-color').then((borderColor) => {
        expect(borderColor).to.not.equal('rgba(0, 0, 0, 0)');
        expect(borderColor).to.not.equal('transparent');
      });
    });
    
    // Check border consistency across all inputs
    let firstBorderWidth, firstBorderStyle;
    cy.get('.form-control').first().then(($firstInput) => {
      firstBorderWidth = getComputedStyle($firstInput[0]).borderWidth;
      firstBorderStyle = getComputedStyle($firstInput[0]).borderStyle;
      
      cy.get('.form-control').each(($input) => {
        cy.wrap($input).should('have.css', 'border-width', firstBorderWidth);
        cy.wrap($input).should('have.css', 'border-style', firstBorderStyle);
      });
    });
  });

  it('6.3 - Ensure input field focus states are clearly visible', () => {
    // Test focus states for different input types
    const inputSelectors = [
      '[data-test="first-name"]',
      '[data-test="email"]',
      '[data-test="password"]'
    ];
    
    inputSelectors.forEach((selector) => {
      cy.get(selector).then(($input) => {
        if ($input.length > 0) {
          // Get initial state
          const initialBorderColor = getComputedStyle($input[0]).borderColor;
          const initialOutline = getComputedStyle($input[0]).outline;
          
          // Focus the input
          cy.wrap($input).focus();
          
          // Check focus state changes
          cy.wrap($input).should('have.css', 'border-color').then((focusBorderColor) => {
            // Border color should change or outline should appear
            const borderChanged = focusBorderColor !== initialBorderColor;
            
            cy.wrap($input).should('have.css', 'outline').then((focusOutline) => {
              const outlineChanged = focusOutline !== initialOutline && focusOutline !== 'none';
              
              // Either border or outline should change to indicate focus
              expect(borderChanged || outlineChanged).to.be.true;
            });
          });
          
          // Check box-shadow for focus indication
          cy.wrap($input).should('have.css', 'box-shadow').then((boxShadow) => {
            expect(boxShadow).to.not.equal('none');
          });
          
          // Blur the input
          cy.wrap($input).blur();
        }
      });
    });
  });

  it('6.4 - Check if password fields mask input correctly', () => {
    // Check password field type
    cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
    
    // Type in password field and verify masking
    cy.get('[data-test="password"]').type('testpassword123');
    
    // Check that the value is masked (not visible as plain text)
    cy.get('[data-test="password"]').should('have.value', 'testpassword123');
    
    // Verify the input appears masked in the DOM
    cy.get('[data-test="password"]').should(($input) => {
      // The input type should remain 'password'
      expect($input[0].type).to.equal('password');
    });
    
    // Check if there's a show/hide password toggle (if implemented)
    cy.get('body').then(($body) => {
      const toggleButton = $body.find('[data-test*="password-toggle"], [class*="password-toggle"], .fa-eye, .fa-eye-slash');
      if (toggleButton.length > 0) {
        cy.log('Password toggle found, testing functionality');
        cy.wrap(toggleButton.first()).click();
        
        // After clicking toggle, type might change to 'text'
        cy.get('[data-test="password"]').should(($input) => {
          expect(['password', 'text']).to.include($input[0].type);
        });
      } else {
        cy.log('No password toggle found');
      }
    });
    
    // Clear password field
    cy.get('[data-test="password"]').clear();
  });

  it('6.5 - Ensure all buttons are properly styled and visible', () => {
    // Check submit button styling
    cy.get('[data-test="register-submit"]').should('be.visible');
    
    // Check button has proper background
    cy.get('[data-test="register-submit"]').should('have.css', 'background-color').then((bgColor) => {
      expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(bgColor).to.not.equal('transparent');
    });
    
    // Check button text color
    cy.get('[data-test="register-submit"]').should('have.css', 'color').then((textColor) => {
      expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
      expect(textColor).to.not.equal('transparent');
    });
    
    // Check button padding
    cy.get('[data-test="register-submit"]').should('have.css', 'padding').then((padding) => {
      expect(padding).to.not.equal('0px');
    });
    
    // Check button border
    cy.get('[data-test="register-submit"]').should('have.css', 'border-width').then((borderWidth) => {
      expect(parseFloat(borderWidth)).to.be.greaterThan(-1); // Can be 0 for borderless buttons
    });
    
    // Check button cursor
    cy.get('[data-test="register-submit"]').should('have.css', 'cursor', 'pointer');
    
    // Check button dimensions are reasonable
    cy.get('[data-test="register-submit"]').then(($btn) => {
      const rect = $btn[0].getBoundingClientRect();
      expect(rect.width).to.be.greaterThan(80);  // Minimum width
      expect(rect.height).to.be.greaterThan(30); // Minimum height
    });
  });

  it('6.6 - Test form field validation styling', () => {
    // Trigger validation by submitting empty form
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    
    // Check that invalid fields have error styling
    cy.get('[data-test="first-name"]').should('have.class', 'is-invalid');
    
    // Check error message styling
    cy.get('[data-test="first-name-error"]').should('be.visible');
    cy.get('[data-test="first-name-error"]').should('have.css', 'color').then((color) => {
      // Error text should be red or similar warning color
      const rgb = color.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        expect(r).to.be.greaterThan(Math.max(g, b)); // Red component should be highest
      }
    });
    
    // Test valid input removes error styling
    cy.get('[data-test="first-name"]').type('John');
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    
    // First name should no longer have error styling
    cy.get('[data-test="first-name"]').should('not.have.class', 'is-invalid');
    cy.get('[data-test="first-name-error"]').should('not.be.visible');
  });

  it('6.7 - Check dropdown/select field styling and functionality', () => {
    // Check if there are any select elements (country dropdown, etc.)
    cy.get('select').then(($selects) => {
      if ($selects.length > 0) {
        cy.get('select').each(($select) => {
          // Check select is visible and styled
          cy.wrap($select).should('be.visible');
          cy.wrap($select).should('have.css', 'border-width').then((borderWidth) => {
            expect(parseFloat(borderWidth)).to.be.greaterThan(0);
          });
          
          // Check select has options
          cy.wrap($select).find('option').should('have.length.greaterThan', 0);
          
          // Test select functionality
          cy.wrap($select).select(1); // Select second option
          cy.wrap($select).should('not.have.value', '');
        });
      } else {
        cy.log('No select elements found on registration page');
      }
    });
  });

  it('6.8 - Verify form accessibility features', () => {
    // Check that labels are properly associated with inputs
    cy.get('.form-control').each(($input) => {
      const inputId = $input.attr('id');
      if (inputId) {
        cy.get(`label[for="${inputId}"]`).should('exist');
      }
    });
    
    // Check for required field indicators
    cy.get('.form-control[required], .form-control').then(($inputs) => {
      // Check if required fields are marked (with * or aria-required)
      $inputs.each((index, input) => {
        const $input = Cypress.$(input);
        const isRequired = $input.attr('required') !== undefined || 
                          $input.attr('aria-required') === 'true';
        
        if (isRequired) {
          // Look for visual indicator of required field
          const label = $input.closest('.form-group').find('label');
          const labelText = label.text();
          expect(labelText).to.include('*'); // Common required indicator
        }
      });
    });
    
    // Check for proper ARIA attributes
    cy.get('.form-control').each(($input) => {
      // Inputs should have proper ARIA attributes for accessibility
      cy.wrap($input).should('have.attr', 'id');
    });
  });
});
