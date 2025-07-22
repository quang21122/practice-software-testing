import '../../support/command.js'

describe('Registration Page - Images & Media', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/auth/register');
    cy.wait(1000);
  });

  it('5.1 - Verify all images load correctly without broken image icons', () => {
    // Check for any images on the registration page
    cy.get('img').then(($images) => {
      if ($images.length > 0) {
        cy.get('img').each(($img) => {
          // Check if image has loaded successfully
          cy.wrap($img).should('be.visible');
          cy.wrap($img).should(($el) => {
            // Check if image has naturalWidth and naturalHeight (indicates successful load)
            expect($el[0].naturalWidth).to.be.greaterThan(0);
            expect($el[0].naturalHeight).to.be.greaterThan(0);
          });
          
          // Check that src attribute is not empty
          cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
          
          // Verify image doesn't have error state
          cy.wrap($img).should(($el) => {
            expect($el[0].complete).to.be.true;
          });
        });
      } else {
        cy.log('No images found on registration page');
      }
    });
    
    // Check for background images in CSS
    cy.get('*').each(($el) => {
      const backgroundImage = getComputedStyle($el[0]).backgroundImage;
      if (backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url(')) {
        cy.log(`Found background image: ${backgroundImage}`);
        // Background images should not be broken (this is harder to test automatically)
        expect(backgroundImage).to.not.include('404');
        expect(backgroundImage).to.not.include('error');
      }
    });
  });

  it('5.2 - Check if images are properly sized and not pixelated', () => {
    cy.get('img').then(($images) => {
      if ($images.length > 0) {
        cy.get('img').each(($img) => {
          cy.wrap($img).should(($el) => {
            const img = $el[0];
            const displayWidth = img.clientWidth;
            const displayHeight = img.clientHeight;
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            
            // Check that image is not scaled up too much (which causes pixelation)
            const scaleX = displayWidth / naturalWidth;
            const scaleY = displayHeight / naturalHeight;
            
            expect(scaleX).to.be.at.most(2); // Not scaled up more than 2x
            expect(scaleY).to.be.at.most(2); // Not scaled up more than 2x
            
            // Check that image has reasonable dimensions
            expect(displayWidth).to.be.greaterThan(0);
            expect(displayHeight).to.be.greaterThan(0);
            expect(naturalWidth).to.be.greaterThan(0);
            expect(naturalHeight).to.be.greaterThan(0);
          });
        });
      } else {
        cy.log('No images found to check sizing');
      }
    });
  });

  it('5.3 - Ensure images maintain aspect ratio and don\'t appear stretched', () => {
    cy.get('img').then(($images) => {
      if ($images.length > 0) {
        cy.get('img').each(($img) => {
          cy.wrap($img).should(($el) => {
            const img = $el[0];
            const displayWidth = img.clientWidth;
            const displayHeight = img.clientHeight;
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            
            // Calculate aspect ratios
            const displayRatio = displayWidth / displayHeight;
            const naturalRatio = naturalWidth / naturalHeight;
            
            // Allow for small rounding differences (within 5%)
            const ratioDifference = Math.abs(displayRatio - naturalRatio) / naturalRatio;
            expect(ratioDifference).to.be.at.most(0.05);
          });
          
          // Check CSS object-fit property if set
          cy.wrap($img).should('have.css', 'object-fit').then((objectFit) => {
            if (objectFit && objectFit !== 'fill') {
              // If object-fit is set to something other than 'fill', it should preserve aspect ratio
              expect(['contain', 'cover', 'scale-down', 'none']).to.include(objectFit);
            }
          });
        });
      } else {
        cy.log('No images found to check aspect ratio');
      }
    });
  });

  it('5.4 - Ensure all icons display correctly and are not broken', () => {
    // Check for icon fonts (FontAwesome, Bootstrap icons, etc.)
    cy.get('i[class*="fa"], i[class*="bi"], i[class*="icon"]').then(($icons) => {
      if ($icons.length > 0) {
        cy.get('i[class*="fa"], i[class*="bi"], i[class*="icon"]').each(($icon) => {
          // Check that icon is visible
          cy.wrap($icon).should('be.visible');
          
          // Check that icon has appropriate font-family
          cy.wrap($icon).should('have.css', 'font-family').then((fontFamily) => {
            expect(fontFamily).to.not.be.empty;
          });
          
          // Check that icon has content (pseudo-element)
          cy.wrap($icon).should(($el) => {
            const beforeContent = getComputedStyle($el[0], ':before').content;
            const afterContent = getComputedStyle($el[0], ':after').content;
            
            // At least one pseudo-element should have content
            expect(beforeContent !== 'none' || afterContent !== 'none').to.be.true;
          });
        });
      } else {
        cy.log('No icon fonts found on registration page');
      }
    });
    
    // Check for SVG icons
    cy.get('svg').then(($svgs) => {
      if ($svgs.length > 0) {
        cy.get('svg').each(($svg) => {
          // Check that SVG is visible
          cy.wrap($svg).should('be.visible');
          
          // Check that SVG has content
          cy.wrap($svg).should(($el) => {
            expect($el[0].children.length).to.be.greaterThan(0);
          });
          
          // Check SVG dimensions
          cy.wrap($svg).should('have.attr', 'width').or('have.attr', 'viewBox');
          cy.wrap($svg).should('have.attr', 'height').or('have.attr', 'viewBox');
        });
      } else {
        cy.log('No SVG icons found on registration page');
      }
    });
    
    // Check for image-based icons
    cy.get('img[src*="icon"], img[class*="icon"]').then(($iconImages) => {
      if ($iconImages.length > 0) {
        cy.get('img[src*="icon"], img[class*="icon"]').each(($iconImg) => {
          // Apply same checks as regular images
          cy.wrap($iconImg).should('be.visible');
          cy.wrap($iconImg).should(($el) => {
            expect($el[0].naturalWidth).to.be.greaterThan(0);
            expect($el[0].naturalHeight).to.be.greaterThan(0);
          });
        });
      } else {
        cy.log('No image-based icons found on registration page');
      }
    });
  });

  it('5.5 - Check for proper alt text on images', () => {
    cy.get('img').then(($images) => {
      if ($images.length > 0) {
        cy.get('img').each(($img) => {
          // Check that images have alt attributes for accessibility
          cy.wrap($img).should('have.attr', 'alt');
          
          // Alt text should be meaningful (not empty or just filename)
          cy.wrap($img).should('have.attr', 'alt').then((altText) => {
            expect(altText).to.not.match(/\.(jpg|jpeg|png|gif|svg)$/i); // Not just filename
            if (altText.trim() === '') {
              // Empty alt is acceptable for decorative images, but log it
              cy.log('Image with empty alt text found (may be decorative)');
            }
          });
        });
      } else {
        cy.log('No images found to check alt text');
      }
    });
  });

  it('5.6 - Verify media elements don\'t interfere with form functionality', () => {
    // Check that any media elements don't block form interactions
    cy.get('[data-test="first-name"]').should('be.visible').click().type('Test');
    cy.get('[data-test="first-name"]').should('have.value', 'Test');
    
    // Check that media elements don't cause layout shifts
    cy.get('img, video, audio').then(($media) => {
      if ($media.length > 0) {
        // Get initial form position
        cy.get('[data-test="register-form"]').then(($form) => {
          const initialRect = $form[0].getBoundingClientRect();
          
          // Wait for any potential media loading
          cy.wait(2000);
          
          // Check form position hasn't shifted significantly
          cy.get('[data-test="register-form"]').then(($formAfter) => {
            const finalRect = $formAfter[0].getBoundingClientRect();
            expect(Math.abs(finalRect.top - initialRect.top)).to.be.lessThan(10);
            expect(Math.abs(finalRect.left - initialRect.left)).to.be.lessThan(10);
          });
        });
      }
    });
    
    // Clear the test input
    cy.get('[data-test="first-name"]').clear();
  });
});
