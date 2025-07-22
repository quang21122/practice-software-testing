#!/usr/bin/env node

/**
 * Cross-Browser Testing Script for Registration Page
 * 
 * This script automates the execution of GUI tests across multiple browsers
 * and generates a comprehensive report with screenshots.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  browsers: ['chrome', 'firefox', 'edge'],
  testSpec: 'cypress/e2e/registration/complete_checklist.cy.js',
  screenshotDir: 'cypress/screenshots',
  reportDir: 'cypress/reports',
  baseUrl: 'http://localhost:4200'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectories() {
  log('📁 Creating necessary directories...', 'blue');
  
  const dirs = [CONFIG.screenshotDir, CONFIG.reportDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`   Created: ${dir}`, 'green');
    }
  });
}

function checkApplicationRunning() {
  log('🔍 Checking if application is running...', 'blue');
  
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${CONFIG.baseUrl}`, 
      { encoding: 'utf8', timeout: 5000 });
    
    if (response.trim() === '200') {
      log('   ✅ Application is running', 'green');
      return true;
    } else {
      log('   ❌ Application is not responding', 'red');
      return false;
    }
  } catch (error) {
    log('   ❌ Cannot reach application. Please start with: ng serve', 'red');
    return false;
  }
}

function runTestsForBrowser(browser) {
  log(`🌐 Running tests in ${browser.toUpperCase()}...`, 'cyan');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(CONFIG.reportDir, `${browser}-report-${timestamp}.json`);
  
  try {
    const command = `npx cypress run --browser ${browser} --spec "${CONFIG.testSpec}" --reporter json --reporter-options "output=${reportFile}"`;
    
    log(`   Executing: ${command}`, 'yellow');
    
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minutes timeout
    });
    
    log(`   ✅ ${browser} tests completed successfully`, 'green');
    
    return {
      browser,
      status: 'PASSED',
      reportFile,
      timestamp,
      output: result
    };
    
  } catch (error) {
    log(`   ❌ ${browser} tests failed`, 'red');
    log(`   Error: ${error.message}`, 'red');
    
    return {
      browser,
      status: 'FAILED',
      reportFile: null,
      timestamp,
      error: error.message
    };
  }
}

function generateComparisonReport(results) {
  log('📊 Generating cross-browser comparison report...', 'blue');
  
  const report = {
    testSuite: 'Registration Page GUI Testing',
    timestamp: new Date().toISOString(),
    summary: {
      totalBrowsers: results.length,
      passed: results.filter(r => r.status === 'PASSED').length,
      failed: results.filter(r => r.status === 'FAILED').length
    },
    browsers: results,
    checklist: {
      '1. Layout & Structure': ['1.1', '1.2', '1.3', '1.4', '1.5'],
      '2. Responsive Design': ['2.1', '2.2', '2.3', '2.4'],
      '3. Colors & Visual Appearance': ['3.1', '3.2', '3.3', '3.4', '3.5'],
      '4. Typography & Text': ['4.1', '4.2', '4.3', '4.4'],
      '5. Images & Media': ['5.1', '5.2', '5.3', '5.4'],
      '6. Forms & Input Elements': ['6.1', '6.2', '6.3', '6.4', '6.5'],
      '7. Browser Compatibility': ['7.1', '7.2', '7.3']
    },
    screenshots: {
      location: CONFIG.screenshotDir,
      naming: 'browser_checkpoint_description.png'
    }
  };
  
  const reportPath = path.join(CONFIG.reportDir, `cross-browser-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`   📄 Report saved to: ${reportPath}`, 'green');
  
  return report;
}

function generateMarkdownReport(report) {
  log('📝 Generating markdown report...', 'blue');
  
  const markdown = `# Cross-Browser Testing Report - Registration Page

## Test Summary
- **Test Suite**: ${report.testSuite}
- **Timestamp**: ${report.timestamp}
- **Total Browsers Tested**: ${report.summary.totalBrowsers}
- **Passed**: ${report.summary.passed}
- **Failed**: ${report.summary.failed}
- **Success Rate**: ${((report.summary.passed / report.summary.totalBrowsers) * 100).toFixed(1)}%

## Browser Results

${report.browsers.map(browser => `
### ${browser.browser.toUpperCase()}
- **Status**: ${browser.status}
- **Timestamp**: ${browser.timestamp}
${browser.status === 'FAILED' ? `- **Error**: ${browser.error}` : ''}
`).join('')}

## Test Coverage

### GUI Testing Checklist
${Object.entries(report.checklist).map(([category, checkpoints]) => `
#### ${category}
${checkpoints.map(cp => `- [x] ${cp}`).join('\n')}
`).join('')}

## Screenshots
Screenshots are saved in: \`${report.screenshots.location}\`

Naming convention: \`${report.screenshots.naming}\`

## Step-by-Step Execution

### Prerequisites
1. Application running on http://localhost:4200
2. Cypress installed and configured
3. Browsers (Chrome, Firefox, Edge) available

### Execution Steps
1. **Chrome Testing**: Primary browser validation
2. **Firefox Testing**: Cross-browser compatibility check
3. **Edge Testing**: Additional browser validation
4. **Report Generation**: Comprehensive analysis

### Expected Outcomes
- All layout and structure tests pass across browsers
- Responsive design works consistently
- Form functionality identical in all browsers
- Minor acceptable differences in styling/rendering

## Recommendations
${report.summary.failed > 0 ? `
⚠️ **Issues Found**: ${report.summary.failed} browser(s) failed testing
- Review failed browser logs
- Check for browser-specific CSS issues
- Verify JavaScript compatibility
` : `
✅ **All Tests Passed**: Registration page is compatible across all tested browsers
- Layout is consistent
- Functionality works properly
- Responsive design is effective
`}

---
*Generated automatically by cross-browser testing script*
`;

  const markdownPath = path.join(CONFIG.reportDir, `cross-browser-report-${Date.now()}.md`);
  fs.writeFileSync(markdownPath, markdown);
  
  log(`   📄 Markdown report saved to: ${markdownPath}`, 'green');
  
  return markdownPath;
}

function printSummary(report) {
  log('\n' + '='.repeat(60), 'bright');
  log('📋 CROSS-BROWSER TESTING SUMMARY', 'bright');
  log('='.repeat(60), 'bright');
  
  log(`🎯 Test Suite: ${report.testSuite}`, 'cyan');
  log(`📅 Timestamp: ${report.timestamp}`, 'cyan');
  log(`🌐 Browsers Tested: ${report.summary.totalBrowsers}`, 'cyan');
  
  log('\n📊 Results:', 'bright');
  report.browsers.forEach(browser => {
    const status = browser.status === 'PASSED' ? '✅' : '❌';
    const color = browser.status === 'PASSED' ? 'green' : 'red';
    log(`   ${status} ${browser.browser.toUpperCase()}: ${browser.status}`, color);
  });
  
  const successRate = ((report.summary.passed / report.summary.totalBrowsers) * 100).toFixed(1);
  log(`\n🎯 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
  
  if (report.summary.failed === 0) {
    log('\n🎉 All browsers passed! Registration page is cross-browser compatible.', 'green');
  } else {
    log(`\n⚠️  ${report.summary.failed} browser(s) failed. Review the detailed reports.`, 'yellow');
  }
  
  log('\n📁 Generated Files:', 'bright');
  log(`   Screenshots: ${CONFIG.screenshotDir}`, 'blue');
  log(`   Reports: ${CONFIG.reportDir}`, 'blue');
  
  log('\n' + '='.repeat(60), 'bright');
}

async function main() {
  log('🚀 Starting Cross-Browser Testing for Registration Page', 'bright');
  log('=' .repeat(60), 'bright');
  
  // Setup
  createDirectories();
  
  // Check if application is running
  if (!checkApplicationRunning()) {
    log('\n❌ Please start the application first:', 'red');
    log('   cd sprint5-with-bugs/UI', 'yellow');
    log('   ng serve', 'yellow');
    process.exit(1);
  }
  
  // Run tests for each browser
  const results = [];
  for (const browser of CONFIG.browsers) {
    const result = runTestsForBrowser(browser);
    results.push(result);
    
    // Small delay between browser tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate reports
  const report = generateComparisonReport(results);
  generateMarkdownReport(report);
  
  // Print summary
  printSummary(report);
  
  // Exit with appropriate code
  const exitCode = report.summary.failed > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    log(`💥 Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, CONFIG };
