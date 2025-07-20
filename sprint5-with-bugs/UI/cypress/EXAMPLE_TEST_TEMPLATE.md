# Template và Ví Dụ Test Cụ Thể Cho Project

## 🎯 Template Test Dựa Trên Project Hiện Tại

### 1. Template cho Navigation Test

```javascript
describe('Navigation Tests', () => {
  beforeEach(() => {
    // Thay đổi URL này thành URL của ứng dụng bạn
    cy.visit('localhost:4200/#/');
  });

  it('Nên điều hướng đúng tất cả các links', () => {
    // Test tất cả internal links
    cy.get('a[href*="#/"]').each(($link) => {
      const href = $link.attr('href');
      cy.wrap($link).click();
      cy.url().should('include', href);
      
      // Quay lại trang chủ để test link tiếp theo
      cy.visit('localhost:4200/#/');
    });
  });

  it('Nên mở external links trong tab mới', () => {
    cy.get('a[href^="http"]').should('have.attr', 'target', '_blank');
  });

  it('Nên hiển thị trang 404 cho URL không tồn tại', () => {
    cy.visit('#/trang-khong-ton-tai', { failOnStatusCode: false });
    cy.contains('404').should('exist');
  });
});
```

### 2. Template cho UI Layout Test

```javascript
describe('UI Layout Tests', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/');
  });

  it('Nên hiển thị header đúng cách', () => {
    // Kiểm tra header tồn tại
    cy.get('header').should('be.visible');
    
    // Kiểm tra logo
    cy.get('header img[alt*="logo"]').should('be.visible');
    
    // Kiểm tra navigation menu
    cy.get('nav').should('be.visible');
  });

  it('Nên hiển thị footer đúng cách', () => {
    // Scroll xuống footer
    cy.get('footer').scrollIntoView();
    cy.get('footer').should('be.visible');
    
    // Kiểm tra copyright
    cy.get('footer').should('contain', '©');
  });

  it('Nên responsive trên mobile', () => {
    // Test trên mobile viewport
    cy.viewport('iphone-6');
    
    // Kiểm tra mobile menu button hiển thị
    cy.get('[data-cy="mobile-menu"]').should('be.visible');
    
    // Kiểm tra desktop menu ẩn
    cy.get('[data-cy="desktop-menu"]').should('not.be.visible');
  });
});
```

### 3. Template cho Form Test

```javascript
describe('Form Tests', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/contact'); // Thay đổi URL phù hợp
  });

  it('Nên submit form thành công với dữ liệu hợp lệ', () => {
    // Điền form
    cy.get('[data-cy="name"]').type('Nguyễn Văn A');
    cy.get('[data-cy="email"]').type('test@example.com');
    cy.get('[data-cy="message"]').type('Đây là tin nhắn test');
    
    // Submit form
    cy.get('[data-cy="submit-button"]').click();
    
    // Kiểm tra thông báo thành công
    cy.get('[data-cy="success-message"]').should('contain', 'Gửi thành công');
  });

  it('Nên hiển thị lỗi validation', () => {
    // Submit form trống
    cy.get('[data-cy="submit-button"]').click();
    
    // Kiểm tra các thông báo lỗi
    cy.get('[data-cy="name-error"]').should('contain', 'Tên không được để trống');
    cy.get('[data-cy="email-error"]').should('contain', 'Email không được để trống');
  });

  it('Nên validate email format', () => {
    cy.get('[data-cy="email"]').type('email-khong-hop-le');
    cy.get('[data-cy="submit-button"]').click();
    
    cy.get('[data-cy="email-error"]').should('contain', 'Email không đúng định dạng');
  });
});
```

### 4. Template cho Product Gallery Test

```javascript
describe('Product Gallery Tests', () => {
  beforeEach(() => {
    cy.visit('localhost:4200/#/products'); // Thay đổi URL phù hợp
  });

  it('Nên hiển thị danh sách sản phẩm', () => {
    // Kiểm tra container sản phẩm
    cy.get('[data-cy="product-grid"]').should('be.visible');
    
    // Kiểm tra có ít nhất 1 sản phẩm
    cy.get('[data-cy="product-item"]').should('have.length.greaterThan', 0);
    
    // Kiểm tra mỗi sản phẩm có đủ thông tin
    cy.get('[data-cy="product-item"]').first().within(() => {
      cy.get('[data-cy="product-image"]').should('be.visible');
      cy.get('[data-cy="product-title"]').should('be.visible');
      cy.get('[data-cy="product-price"]').should('be.visible');
    });
  });

  it('Nên filter sản phẩm theo category', () => {
    // Click vào category filter
    cy.get('[data-cy="category-filter"]').select('Electronics');
    
    // Kiểm tra sản phẩm được filter
    cy.get('[data-cy="product-item"]').should('contain', 'Electronics');
  });

  it('Nên sort sản phẩm theo giá', () => {
    // Sort theo giá tăng dần
    cy.get('[data-cy="sort-select"]').select('price-asc');
    
    // Kiểm tra thứ tự sắp xếp
    cy.get('[data-cy="product-price"]').then(($prices) => {
      const prices = [...$prices].map(el => parseFloat(el.textContent.replace(/[^0-9.]/g, '')));
      expect(prices).to.deep.equal(prices.sort((a, b) => a - b));
    });
  });

  it('Nên search sản phẩm', () => {
    // Nhập từ khóa search
    cy.get('[data-cy="search-input"]').type('laptop');
    cy.get('[data-cy="search-button"]').click();
    
    // Kiểm tra kết quả search
    cy.get('[data-cy="product-title"]').should('contain', 'laptop');
  });
});
```

### 5. Template cho Performance Test

```javascript
describe('Performance Tests', () => {
  it('Nên load trang trong thời gian hợp lý', () => {
    const start = Date.now();
    
    cy.visit('localhost:4200/#/').then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(3000); // Dưới 3 giây
    });
  });

  it('Nên load images đúng cách', () => {
    cy.visit('localhost:4200/#/');
    
    // Kiểm tra tất cả images load thành công
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible');
      cy.wrap($img).should('have.prop', 'naturalWidth').and('be.greaterThan', 0);
    });
  });
});
```

## 🔧 Cách Sử Dụng Templates

### Bước 1: Copy template phù hợp
Chọn template phù hợp với chức năng bạn muốn test

### Bước 2: Thay đổi selectors
Thay đổi các `data-cy` attributes thành selectors thực tế của ứng dụng:

```javascript
// Thay vì:
cy.get('[data-cy="product-title"]')

// Sử dụng:
cy.get('.product-title')        // class
cy.get('#product-title')        // id  
cy.get('h2.title')             // tag + class
cy.contains('Product Name')     // text content
```

### Bước 3: Cập nhật URLs
Thay đổi URLs trong `cy.visit()` thành URLs thực tế của ứng dụng

### Bước 4: Thêm test data
Thêm dữ liệu test phù hợp với ứng dụng của bạn

## 📋 Checklist Trước Khi Chạy Test

- [ ] Đã cập nhật URLs trong `cy.visit()`
- [ ] Đã thay đổi selectors phù hợp với HTML thực tế
- [ ] Đã thêm `data-cy` attributes vào HTML (khuyến nghị)
- [ ] Đã kiểm tra ứng dụng đang chạy trên localhost
- [ ] Đã cài đặt Cypress dependencies

## 🚀 Lệnh Chạy Test

```bash
# Mở Cypress Test Runner
npx cypress open

# Chạy tất cả tests trong terminal
npx cypress run

# Chạy một file test cụ thể
npx cypress run --spec "cypress/e2e/navigation.cy.js"

# Chạy tests trên browser cụ thể
npx cypress run --browser chrome
```

## 💡 Tips Quan Trọng

1. **Luôn kiểm tra element tồn tại trước khi tương tác**
2. **Sử dụng `data-cy` attributes thay vì class/id**
3. **Viết assertions rõ ràng và cụ thể**
4. **Test cả happy path và error cases**
5. **Đảm bảo tests độc lập với nhau**
