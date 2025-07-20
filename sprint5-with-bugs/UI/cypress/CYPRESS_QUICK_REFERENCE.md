# Cypress Quick Reference - Tham Khảo Nhanh

## 🎯 Selectors (Cách chọn elements)

```javascript
// Theo ID
cy.get('#my-id')

// Theo Class
cy.get('.my-class')

// Theo Attribute
cy.get('[data-cy="my-element"]')     // Khuyến nghị
cy.get('[type="submit"]')
cy.get('[href="/login"]')

// Theo Tag
cy.get('button')
cy.get('input')
cy.get('form')

// Theo Text Content
cy.contains('Click me')
cy.contains('button', 'Submit')      // button có text "Submit"

// Kết hợp selectors
cy.get('form input[type="email"]')
cy.get('.navbar a[href="/home"]')

// Pseudo selectors
cy.get('li:first')
cy.get('li:last')
cy.get('li:nth-child(2)')
```

## 🖱️ Actions (Hành động)

```javascript
// Click
cy.get('button').click()
cy.get('button').dblclick()          // Double click
cy.get('button').rightclick()        // Right click

// Type text
cy.get('input').type('Hello World')
cy.get('input').type('{enter}')      // Nhấn Enter
cy.get('input').type('{backspace}')  // Nhấn Backspace
cy.get('input').clear()              // Xóa text

// Select dropdown
cy.get('select').select('option1')
cy.get('select').select(['opt1', 'opt2'])  // Multiple select

// Checkbox/Radio
cy.get('input[type="checkbox"]').check()
cy.get('input[type="checkbox"]').uncheck()
cy.get('input[type="radio"]').check()

// File upload
cy.get('input[type="file"]').selectFile('path/to/file.jpg')

// Scroll
cy.scrollTo('bottom')
cy.scrollTo(0, 500)                  // x, y coordinates
cy.get('.element').scrollIntoView()
```

## ✅ Assertions (Kiểm tra)

```javascript
// Visibility
cy.get('.element').should('be.visible')
cy.get('.element').should('not.be.visible')
cy.get('.element').should('exist')
cy.get('.element').should('not.exist')

// Text content
cy.get('h1').should('contain', 'Welcome')
cy.get('h1').should('have.text', 'Exact text')
cy.get('h1').should('include.text', 'partial')

// Attributes
cy.get('input').should('have.attr', 'placeholder', 'Enter name')
cy.get('button').should('have.class', 'btn-primary')
cy.get('input').should('have.value', 'test@example.com')

// States
cy.get('button').should('be.disabled')
cy.get('button').should('be.enabled')
cy.get('input').should('be.focused')
cy.get('checkbox').should('be.checked')

// Numbers and length
cy.get('.items').should('have.length', 5)
cy.get('.items').should('have.length.greaterThan', 3)
cy.get('.items').should('have.length.lessThan', 10)

// URL
cy.url().should('include', '/dashboard')
cy.url().should('eq', 'https://example.com/page')

// Multiple assertions
cy.get('button')
  .should('be.visible')
  .and('contain', 'Submit')
  .and('have.class', 'btn-primary')
```

## 🌐 Navigation

```javascript
// Visit pages
cy.visit('/')
cy.visit('/login')
cy.visit('https://example.com')

// Browser navigation
cy.go('back')
cy.go('forward')
cy.reload()

// URL operations
cy.url().then((url) => {
  // Do something with URL
})
```

## ⏱️ Waiting & Timing

```javascript
// Wait for element
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')

// Wait for specific time (tránh dùng)
cy.wait(1000)

// Wait for API calls
cy.intercept('GET', '/api/users').as('getUsers')
cy.wait('@getUsers')

// Custom timeout
cy.get('.slow-element', { timeout: 10000 }).should('be.visible')
```

## 🔄 API Testing

```javascript
// Intercept API calls
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers')
cy.intercept('POST', '/api/login', { statusCode: 200 }).as('login')

// Wait for API
cy.wait('@getUsers')

// Check API calls
cy.wait('@login').then((interception) => {
  expect(interception.response.statusCode).to.eq(200)
})

// Make direct API calls
cy.request('GET', '/api/users').then((response) => {
  expect(response.status).to.eq(200)
})
```

## 📱 Viewport & Device Testing

```javascript
// Set viewport size
cy.viewport(1280, 720)
cy.viewport('iphone-6')
cy.viewport('ipad-2')

// Common viewports
cy.viewport('macbook-15')    // 1440x900
cy.viewport('macbook-13')    // 1280x800
cy.viewport('iphone-x')      // 375x812
cy.viewport('samsung-s10')   // 360x760
```

## 🔧 Utilities

```javascript
// Get window object
cy.window().then((win) => {
  // Access window properties
})

// Get document
cy.document().then((doc) => {
  // Access document
})

// Execute JavaScript
cy.window().its('localStorage').invoke('setItem', 'key', 'value')

// Take screenshot
cy.screenshot()
cy.screenshot('my-screenshot')

// Debug
cy.debug()
cy.pause()
```

## 🎭 Custom Commands

Trong file `cypress/support/commands.js`:

```javascript
// Define custom command
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-cy="username"]').type(username)
  cy.get('[data-cy="password"]').type(password)
  cy.get('[data-cy="login-btn"]').click()
})

// Use custom command
cy.login('user@example.com', 'password123')
```

## 🔍 Finding Elements

```javascript
// Within a parent element
cy.get('.form').within(() => {
  cy.get('input[name="email"]').type('test@example.com')
  cy.get('button').click()
})

// Find child elements
cy.get('.parent').find('.child')

// Filter elements
cy.get('li').filter('.active')

// Get specific element by index
cy.get('li').eq(0)        // First element
cy.get('li').first()      // First element
cy.get('li').last()       // Last element

// Get parent/sibling elements
cy.get('.child').parent()
cy.get('.element').siblings()
cy.get('.element').next()
cy.get('.element').prev()
```

## 📝 Form Handling

```javascript
// Form submission
cy.get('form').submit()

// Input types
cy.get('input[type="email"]').type('test@example.com')
cy.get('input[type="password"]').type('password123')
cy.get('input[type="number"]').type('123')
cy.get('input[type="date"]').type('2023-12-25')

// Textarea
cy.get('textarea').type('Long text content here...')

// Select options
cy.get('select').select('value')
cy.get('select').select(['value1', 'value2'])  // Multiple

// Radio buttons
cy.get('input[type="radio"][value="option1"]').check()

// Checkboxes
cy.get('input[type="checkbox"]').check(['option1', 'option2'])
```

## 🚨 Error Handling

```javascript
// Handle expected failures
cy.visit('/404-page', { failOnStatusCode: false })

// Conditional testing
cy.get('body').then(($body) => {
  if ($body.find('.modal').length > 0) {
    cy.get('.modal .close').click()
  }
})

// Try-catch equivalent
cy.get('.element').should('exist').then(() => {
  // Element exists, do something
}).catch(() => {
  // Element doesn't exist, handle gracefully
})
```

## 🎯 Best Practices Quick Tips

1. **Sử dụng `data-cy` attributes**
2. **Tránh dùng `cy.wait(time)`**
3. **Viết assertions cụ thể**
4. **Test behavior, không test implementation**
5. **Giữ tests độc lập**
6. **Sử dụng `beforeEach` cho setup**
7. **Tạo custom commands cho actions lặp lại**
