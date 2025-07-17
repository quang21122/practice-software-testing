import '../../support/command.js'

describe('UI Layout and Alignment', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('1.1.1 - UI components do not overlap, overflow and display correctly', () => {
    cy.shouldNotOverflowCardBody();
    // cy.percySnapshot('Layout - No Overlap');
  });

  it('1.1.2 - Spacing between components is even and reasonable', () => {
    cy.document().then((doc) => {
      const rootFontSize = parseFloat(getComputedStyle(doc.documentElement).fontSize) || 16;
      cy.log(`Root font size: ${rootFontSize}px`);

      cy.get('.card').then(($cards) => {
        if ($cards.length < 2) {
          cy.log('Fewer than 2 cards found, skipping margin checks');
          return;
        }

        // Log card positions for debugging
        cy.log('Card positions:');
        $cards.each((i, card) => {
          const rect = card.getBoundingClientRect();
          cy.log(`Card ${i + 1}: top=${rect.top.toFixed(2)}px, bottom=${rect.bottom.toFixed(2)}px`);
        });

        // Group cards by row based on top position
        const cardsByRow = {};
        $cards.each((i, card) => {
          const rect = card.getBoundingClientRect();
          const rowKey = Math.round(rect.top); // Use top position to group rows
          if (!cardsByRow[rowKey]) cardsByRow[rowKey] = [];
          cardsByRow[rowKey].push({ index: i, rect });
        });

        const rows = Object.values(cardsByRow).sort((a, b) => a[0].rect.top - b[0].rect.top);
        cy.log(`Detected ${rows.length} rows of cards`);

        // Calculate margins between rows
        const margins = [];
        for (let i = 1; i < rows.length; i++) {
          const prevRow = rows[i - 1];
          const currentRow = rows[i];
          const prevBottom = prevRow[prevRow.length - 1].rect.bottom;
          const currentTop = currentRow[0].rect.top;
          const marginPx = currentTop - prevBottom;
          const marginRem = marginPx / rootFontSize;

          if (marginRem > 0) {
            margins.push(marginRem);
            cy.log(`Margin between row ${i} and ${i + 1}: ${marginRem.toFixed(2)}rem (${marginPx.toFixed(2)}px)`);
          } else {
            cy.log(`Invalid margin between row ${i} and ${i + 1}: ${marginRem.toFixed(2)}rem (${marginPx.toFixed(2)}px)`);
          }
        }

        if (margins.length === 0) {
          cy.log('No valid margins found, check layout or selectors');
          return;
        }

        // Calculate average margin in rem
        const averageMargin = margins.reduce((sum, margin) => sum + margin, 0) / margins.length;
        cy.log(`Average margin: ${averageMargin.toFixed(2)}rem`);

        // Define reasonable range in rem (0.5rem to 3rem)
        const minMargin = Math.max(0.5, averageMargin * 0.5);
        const maxMargin = Math.min(3, averageMargin * 1.5);
        cy.log(`Reasonable margin range: ${minMargin.toFixed(2)}rem to ${maxMargin.toFixed(2)}rem`);

        // Check margins are within reasonable range
        margins.forEach((margin, index) => {
          expect(margin).to.be.within(
            minMargin,
            maxMargin,
            `Margin between row ${index + 1} and ${index + 2} is not reasonable (${margin.toFixed(2)}rem)`
          );
        });

        // Check for consistency
        const maxDeviation = averageMargin * 0.5;
        cy.log(`Maximum allowed deviation: ${maxDeviation.toFixed(2)}rem`);
        margins.forEach((margin, index) => {
          expect(Math.abs(margin - averageMargin)).to.be.at.most(
            maxDeviation,
            `Margin between row ${index + 1} and ${index + 2} varies too much (${margin.toFixed(2)}rem vs ${averageMargin.toFixed(2)}rem)`
          );
        });
      });
    });
  });

  it('1.1.4 - Sections are aligned appropriately', () => {
    cy.get('[data-test="filters"]').should('have.css', 'text-align', 'left'); // Example alignment check
  });
});
