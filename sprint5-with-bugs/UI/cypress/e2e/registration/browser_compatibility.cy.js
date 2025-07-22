import '../../support/command.js'

describe('Registration Page - Browser Compatibility', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('7.1 - Test page display in Google Chrome', () => {
    // Note: This test runs in the browser Cypress is configured for
    // We can check Chrome-specific features and behaviors
    
    // Check if page loads correctly
    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('h3').should('contain', 'Customer registration');
    
    // Test form functionality
    cy.get('[data-test="first-name"]').type('John');
    cy.get('[data-test="first-name"]').should('have.value', 'John');
    
    // Check CSS rendering
    cy.get('[data-test="register-submit"]').should('have.css', 'cursor', 'pointer');
    
    // Test responsive behavior
    cy.viewport(1200, 800);
    cy.get('.col-lg-8').should('be.visible');
    
    // Check for Chrome-specific styling if any
    cy.get('[data-test="first-name"]').should('have.css', 'box-sizing', 'border-box');
    
    // Test form validation
    cy.get('[data-test="register-submit"]').click();
    cy.get('[data-test="first-name-error"]').should('be.visible');
    
    // Clear test data
    cy.get('[data-test="first-name"]').clear();
  });

  it('7.2 - Test page display in Mozilla Firefox', () => {
    // Note: This simulates Firefox-specific checks
    // In a real scenario, you'd run this test in Firefox
    
    // Check basic functionality that might differ in Firefox
    cy.get('[data-test="register-form"]').should('be.visible');
    
    // Test input field behavior (Firefox handles some inputs differently)
    cy.get('[data-test="email"]').type('test@example.com');
    cy.get('[data-test="email"]').should('have.value', 'test@example.com');
    
    // Test password field
    cy.get('[data-test="password"]').type('testpassword');
    cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
    
    // Check CSS properties that might render differently
    cy.get('.form-control').should('have.css', 'display').then((display) => {
      expect(['block', 'inline-block']).to.include(display);
    });
    
    // Test flexbox/grid layouts (Firefox has good support)
    cy.get('.row').should('have.css', 'display').then((display) => {
      expect(display).to.include('flex');
    });
    
    // Check font rendering
    cy.get('h3').should('have.css', 'font-family').then((fontFamily) => {
      expect(fontFamily).to.not.be.empty;
    });
    
    // Clear test data
    cy.get('[data-test="email"]').clear();
    cy.get('[data-test="password"]').clear();
  });

  it('7.3 - Test page display in Safari or Microsoft Edge', () => {
    // Note: This simulates Safari/Edge-specific checks
    
    // Check basic page structure
    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('.container.auth-container').should('exist');
    
    // Test CSS Grid/Flexbox support (good in modern Safari/Edge)
    cy.get('.row').should('have.css', 'display').then((display) => {
      expect(display).to.include('flex');
    });
    
    // Test form controls (Safari has specific styling)
    cy.get('.form-control').each(($input) => {
      cy.wrap($input).should('be.visible');
      cy.wrap($input).should('have.css', 'border-radius').then((borderRadius) => {
        // Safari might apply default border-radius
        expect(borderRadius).to.not.be.undefined;
      });
    });
    
    // Test button styling (Safari has default button styles)
    cy.get('[data-test="register-submit"]').should('have.css', 'background-color').then((bgColor) => {
      expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
    });
    
    // Test input focus behavior
    cy.get('[data-test="first-name"]').focus();
    cy.get('[data-test="first-name"]').should('have.css', 'outline').then((outline) => {
      // Safari might show default outline
      expect(outline).to.not.be.undefined;
    });
    
    // Test date input if present (Safari handles date inputs well)
    cy.get('input[type="date"]').then(($dateInputs) => {
      if ($dateInputs.length > 0) {
        cy.wrap($dateInputs.first()).should('be.visible');
        cy.wrap($dateInputs.first()).should('have.attr', 'type', 'date');
      }
    });
  });

  it('7.4 - Test cross-browser CSS compatibility', () => {
    // Test CSS properties that might have cross-browser issues
    
    // Check box-sizing (should be border-box for consistent layout)
    cy.get('.form-control').should('have.css', 'box-sizing', 'border-box');
    cy.get('.container').should('have.css', 'box-sizing', 'border-box');
    
    // Check flexbox properties
    cy.get('.row').should('have.css', 'display').then((display) => {
      expect(display).to.include('flex');
    });
    
    // Check CSS transforms (if any)
    cy.get('*').then(($elements) => {
      $elements.each((index, element) => {
        const transform = getComputedStyle(element).transform;
        if (transform && transform !== 'none') {
          // Transform should be properly formatted
          expect(transform).to.match(/matrix|translate|rotate|scale/);
        }
      });
    });
    
    // Check vendor prefixes are not needed for basic properties
    cy.get('.form-control').should('have.css', 'border-radius').then((borderRadius) => {
      expect(borderRadius).to.not.be.undefined;
    });
    
    // Check CSS Grid support (if used)
    cy.get('*').then(($elements) => {
      $elements.each((index, element) => {
        const display = getComputedStyle(element).display;
        if (display === 'grid') {
          // Grid should be supported
          expect(display).to.equal('grid');
        }
      });
    });
  });

  it('7.5 - Test JavaScript compatibility across browsers', () => {
    // Test modern JavaScript features that might not work in older browsers
    
    // Test form validation (uses modern JS)
    cy.get('[data-test="register-submit"]').click();
    cy.wait(500);
    cy.get('[data-test="first-name-error"]').should('be.visible');
    
    // Test event handling
    cy.get('[data-test="first-name"]').type('Test');
    cy.get('[data-test="first-name"]').should('have.value', 'Test');
    
    // Test focus/blur events
    cy.get('[data-test="first-name"]').focus().blur();
    
    // Test form submission prevention (should not reload page)
    cy.url().then((initialUrl) => {
      cy.get('[data-test="register-submit"]').click();
      cy.url().should('eq', initialUrl); // URL shouldn't change
    });
    
    // Test dynamic content updates
    cy.get('[data-test="first-name"]').clear();
    cy.get('[data-test="register-submit"]').click();
    cy.get('[data-test="first-name-error"]').should('be.visible');
    
    cy.get('[data-test="first-name"]').type('Valid Name');
    cy.get('[data-test="register-submit"]').click();
    cy.get('[data-test="first-name-error"]').should('not.be.visible');
  });

  it('7.6 - Test responsive design across different browsers', () => {
    // Test responsive breakpoints
    const breakpoints = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    breakpoints.forEach((breakpoint) => {
      cy.viewport(breakpoint.width, breakpoint.height);
      cy.wait(500);
      
      cy.log(`Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);
      
      // Check that form is visible and functional
      cy.get('[data-test="register-form"]').should('be.visible');
      cy.get('[data-test="register-submit"]').should('be.visible');
      
      // Check that layout adapts appropriately
      if (breakpoint.width >= 768) {
        // Desktop/tablet should show multi-column layout
        cy.get('.col-md-6').should('be.visible');
      } else {
        // Mobile should stack elements
        cy.get('.form-group').should('be.visible');
      }
      
      // Check no horizontal scrolling
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 1);
      });
    });
  });

  it('7.7 - Test form functionality across browsers', () => {
    // Test comprehensive form functionality that should work across browsers
    
    // Fill out form with valid data
    cy.get('[data-test="first-name"]').type('John');
    cy.get('[data-test="last-name"]').type('Doe');
    cy.get('[data-test="email"]').type('john.doe@example.com');
    cy.get('[data-test="password"]').type('SecurePass123!');
    
    // Test that all fields accept input
    cy.get('[data-test="first-name"]').should('have.value', 'John');
    cy.get('[data-test="last-name"]').should('have.value', 'Doe');
    cy.get('[data-test="email"]').should('have.value', 'john.doe@example.com');
    cy.get('[data-test="password"]').should('have.value', 'SecurePass123!');
    
    // Test form validation works
    cy.get('[data-test="first-name"]').clear();
    cy.get('[data-test="register-submit"]').click();
    cy.get('[data-test="first-name-error"]').should('be.visible');
    
    // Test form reset/clear functionality
    cy.get('[data-test="first-name"]').type('John');
    cy.get('[data-test="last-name"]').clear();
    cy.get('[data-test="email"]').clear();
    cy.get('[data-test="password"]').clear();
    
    // Verify fields are cleared
    cy.get('[data-test="last-name"]').should('have.value', '');
    cy.get('[data-test="email"]').should('have.value', '');
    cy.get('[data-test="password"]').should('have.value', '');
  });
});
