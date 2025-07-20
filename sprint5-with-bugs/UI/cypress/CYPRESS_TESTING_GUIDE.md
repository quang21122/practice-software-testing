# Hướng Dẫn Viết Test Script Cypress Cho Người Mới Bắt Đầu

## 📋 Mục Lục

1. [Giới thiệu về Cypress](#giới-thiệu-về-cypress)
2. [Cấu trúc cơ bản của một test](#cấu-trúc-cơ-bản-của-một-test)
3. [Các lệnh Cypress cơ bản](#các-lệnh-cypress-cơ-bản)
4. [Cách viết test đầu tiên](#cách-viết-test-đầu-tiên)
5. [Ví dụ thực tế](#ví-dụ-thực-tế)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## 🚀 Giới thiệu về Cypress

Cypress là một công cụ testing tự động cho web applications. Nó giúp bạn:

- Test giao diện người dùng (UI)
- Kiểm tra các chức năng của website
- Tự động hóa các thao tác click, type, navigate

## 📁 Cấu trúc cơ bản của một test

```javascript
describe("Tên nhóm test", () => {
  beforeEach(() => {
    // Code chạy trước mỗi test
    cy.visit("https://example.com");
  });

  it("Mô tả test case", () => {
    // Code test ở đây
  });
});
```

### Giải thích:

- `describe()`: Nhóm các test cases liên quan
- `it()`: Một test case cụ thể
- `beforeEach()`: Chạy trước mỗi test (optional)

## 🛠️ Các lệnh Cypress cơ bản

### 1. Navigation (Điều hướng)

```javascript
cy.visit("https://example.com"); // Mở trang web
cy.go("back"); // Quay lại trang trước
cy.go("forward"); // Tiến tới trang sau
cy.reload(); // Reload trang
```

### 2. Finding Elements (Tìm phần tử)

```javascript
cy.get("#id"); // Tìm theo ID
cy.get(".class-name"); // Tìm theo class
cy.get('[data-cy="element"]'); // Tìm theo data attribute (khuyến nghị)
cy.get("button"); // Tìm theo tag name
cy.contains("Text"); // Tìm theo text content
```

### 3. Interactions (Tương tác)

```javascript
cy.get("button").click(); // Click vào button
cy.get("input").type("Hello World"); // Nhập text
cy.get("input").clear(); // Xóa text
cy.get("select").select("option1"); // Chọn option trong dropdown
cy.get("checkbox").check(); // Check checkbox
cy.get("checkbox").uncheck(); // Uncheck checkbox
```

### 4. Assertions (Kiểm tra)

```javascript
cy.get("h1").should("contain", "Welcome"); // Kiểm tra text
cy.get("input").should("have.value", "test"); // Kiểm tra value
cy.get("button").should("be.visible"); // Kiểm tra hiển thị
cy.get("button").should("be.disabled"); // Kiểm tra disabled
cy.url().should("include", "/dashboard"); // Kiểm tra URL
```

## ✍️ Cách viết test đầu tiên

### Bước 1: Tạo file test

Tạo file mới trong thư mục `e2e/` với tên `my-first-test.cy.js`

### Bước 2: Viết test cơ bản

```javascript
describe("Test đầu tiên của tôi", () => {
  it("Nên mở được trang chủ", () => {
    // Bước 1: Mở trang web
    cy.visit("https://example.com");

    // Bước 2: Kiểm tra title trang
    cy.title().should("contain", "Example");

    // Bước 3: Kiểm tra có hiển thị logo
    cy.get(".logo").should("be.visible");
  });
});
```

## 🎯 Ví dụ thực tế

### Test Login Form

```javascript
describe("Test chức năng đăng nhập", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Đăng nhập thành công với thông tin hợp lệ", () => {
    // Nhập username
    cy.get('[data-cy="username"]').type("testuser");

    // Nhập password
    cy.get('[data-cy="password"]').type("password123");

    // Click nút đăng nhập
    cy.get('[data-cy="login-button"]').click();

    // Kiểm tra chuyển hướng đến dashboard
    cy.url().should("include", "/dashboard");

    // Kiểm tra hiển thị thông báo thành công
    cy.get(".success-message").should("contain", "Đăng nhập thành công");
  });

  it("Hiển thị lỗi khi thông tin không hợp lệ", () => {
    // Nhập thông tin sai
    cy.get('[data-cy="username"]').type("wronguser");
    cy.get('[data-cy="password"]').type("wrongpass");
    cy.get('[data-cy="login-button"]').click();

    // Kiểm tra hiển thị thông báo lỗi
    cy.get(".error-message").should("contain", "Thông tin đăng nhập không đúng");
  });
});
```

### Test Navigation

```javascript
describe("Test điều hướng trang", () => {
  it("Nên điều hướng đúng các menu", () => {
    cy.visit("/");

    // Click vào menu "Sản phẩm"
    cy.get('[data-cy="products-menu"]').click();
    cy.url().should("include", "/products");

    // Click vào menu "Giới thiệu"
    cy.get('[data-cy="about-menu"]').click();
    cy.url().should("include", "/about");

    // Kiểm tra breadcrumb
    cy.get(".breadcrumb").should("contain", "Giới thiệu");
  });
});
```

## 💡 Best Practices

### 1. Sử dụng data attributes

```javascript
// ✅ Tốt - sử dụng data-cy
cy.get('[data-cy="submit-button"]');

// ❌ Tránh - sử dụng class hoặc id có thể thay đổi
cy.get(".btn-primary");
cy.get("#submit-123");
```

### 2. Viết assertions rõ ràng

```javascript
// ✅ Tốt - rõ ràng về mong đợi
cy.get('[data-cy="username"]').should("have.value", "john@example.com");

// ❌ Tránh - không rõ ràng
cy.get('[data-cy="username"]').should("exist");
```

### 3. Sử dụng beforeEach cho setup

```javascript
describe("Product Tests", () => {
  beforeEach(() => {
    cy.visit("/products");
    cy.login("testuser", "password"); // Custom command
  });

  it("should display products", () => {
    // Test code here
  });
});
```

### 4. Tạo custom commands

Trong file `support/commands.js`:

```javascript
Cypress.Commands.add("login", (username, password) => {
  cy.get('[data-cy="username"]').type(username);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="login-button"]').click();
});
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **Element not found**

   ```javascript
   // Đợi element xuất hiện
   cy.get('[data-cy="button"]', { timeout: 10000 }).click();
   ```

2. **Element not visible**

   ```javascript
   // Scroll đến element
   cy.get('[data-cy="button"]').scrollIntoView().click();
   ```

3. **Timing issues**
   ```javascript
   // Đợi API call hoàn thành
   cy.intercept("GET", "/api/data").as("getData");
   cy.wait("@getData");
   ```

## 🎯 Template cho test mới

```javascript
describe("Tên chức năng cần test", () => {
  beforeEach(() => {
    // Setup trước mỗi test
    cy.visit("/page-url");
  });

  it("Nên làm được điều gì đó", () => {
    // Arrange (Chuẩn bị)
    // Act (Thực hiện hành động)
    // Assert (Kiểm tra kết quả)
  });

  it("Nên xử lý được trường hợp lỗi", () => {
    // Test negative cases
  });
});
```

## 🧪 Ví dụ Test cho E-commerce Website

### Test tìm kiếm sản phẩm

```javascript
describe("Chức năng tìm kiếm sản phẩm", () => {
  beforeEach(() => {
    cy.visit("/products");
  });

  it("Nên tìm được sản phẩm theo từ khóa", () => {
    // Nhập từ khóa tìm kiếm
    cy.get('[data-cy="search-input"]').type("laptop");
    cy.get('[data-cy="search-button"]').click();

    // Kiểm tra kết quả
    cy.get('[data-cy="product-list"]').should("be.visible");
    cy.get('[data-cy="product-item"]').should("have.length.greaterThan", 0);
    cy.get('[data-cy="product-title"]').should("contain", "laptop");
  });

  it("Nên hiển thị thông báo khi không tìm thấy", () => {
    cy.get('[data-cy="search-input"]').type("xyz123notfound");
    cy.get('[data-cy="search-button"]').click();

    cy.get('[data-cy="no-results"]').should("contain", "Không tìm thấy sản phẩm");
  });
});
```

### Test giỏ hàng

```javascript
describe("Chức năng giỏ hàng", () => {
  beforeEach(() => {
    cy.visit("/products");
  });

  it("Nên thêm sản phẩm vào giỏ hàng", () => {
    // Chọn sản phẩm đầu tiên
    cy.get('[data-cy="product-item"]').first().click();

    // Thêm vào giỏ hàng
    cy.get('[data-cy="add-to-cart"]').click();

    // Kiểm tra thông báo thành công
    cy.get('[data-cy="success-message"]').should("contain", "Đã thêm vào giỏ hàng");

    // Kiểm tra số lượng trong giỏ hàng
    cy.get('[data-cy="cart-count"]').should("contain", "1");
  });

  it("Nên cập nhật số lượng sản phẩm", () => {
    // Thêm sản phẩm vào giỏ
    cy.get('[data-cy="product-item"]').first().click();
    cy.get('[data-cy="add-to-cart"]').click();

    // Vào trang giỏ hàng
    cy.get('[data-cy="cart-icon"]').click();

    // Tăng số lượng
    cy.get('[data-cy="quantity-increase"]').click();
    cy.get('[data-cy="quantity-input"]').should("have.value", "2");

    // Kiểm tra tổng tiền cập nhật
    cy.get('[data-cy="total-price"]').should("not.contain", "0");
  });
});
```

## 🎨 Test UI Components

### Test Form Validation

```javascript
describe("Validation form đăng ký", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Nên hiển thị lỗi khi email không hợp lệ", () => {
    cy.get('[data-cy="email"]').type("invalid-email");
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="email-error"]').should("contain", "Email không hợp lệ");
  });

  it("Nên hiển thị lỗi khi password quá ngắn", () => {
    cy.get('[data-cy="password"]').type("123");
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="password-error"]').should("contain", "Password phải có ít nhất 6 ký tự");
  });
});
```

### Test Responsive Design

```javascript
describe("Test responsive design", () => {
  it("Nên hiển thị đúng trên mobile", () => {
    cy.viewport("iphone-6");
    cy.visit("/");

    // Kiểm tra menu mobile
    cy.get('[data-cy="mobile-menu-button"]').should("be.visible");
    cy.get('[data-cy="desktop-menu"]').should("not.be.visible");
  });

  it("Nên hiển thị đúng trên desktop", () => {
    cy.viewport(1280, 720);
    cy.visit("/");

    // Kiểm tra menu desktop
    cy.get('[data-cy="desktop-menu"]').should("be.visible");
    cy.get('[data-cy="mobile-menu-button"]').should("not.be.visible");
  });
});
```

## 🔄 Test API Integration

```javascript
describe("Test API calls", () => {
  it("Nên load dữ liệu từ API", () => {
    // Intercept API call
    cy.intercept("GET", "/api/products", { fixture: "products.json" }).as("getProducts");

    cy.visit("/products");

    // Đợi API call hoàn thành
    cy.wait("@getProducts");

    // Kiểm tra dữ liệu hiển thị
    cy.get('[data-cy="product-list"]').should("be.visible");
  });

  it("Nên xử lý lỗi API", () => {
    // Mock API error
    cy.intercept("GET", "/api/products", { statusCode: 500 }).as("getProductsError");

    cy.visit("/products");
    cy.wait("@getProductsError");

    // Kiểm tra hiển thị thông báo lỗi
    cy.get('[data-cy="error-message"]').should("contain", "Có lỗi xảy ra");
  });
});
```

## 📝 Checklist cho Test Case

Khi viết một test case, hãy đảm bảo:

- [ ] **Tên test rõ ràng**: Mô tả chính xác điều gì được test
- [ ] **Setup đầy đủ**: beforeEach() hoặc setup cần thiết
- [ ] **Test data**: Sử dụng data test, không dùng data thật
- [ ] **Assertions đầy đủ**: Kiểm tra tất cả kết quả mong đợi
- [ ] **Cleanup**: Dọn dẹp sau test nếu cần
- [ ] **Independent**: Test không phụ thuộc vào test khác

## 🚨 Lưu ý quan trọng

### 1. Không test những gì không cần thiết

```javascript
// ❌ Không cần test
it("Nên có màu xanh cho button", () => {
  cy.get("button").should("have.css", "color", "blue");
});

// ✅ Nên test
it("Nên submit form khi click button", () => {
  cy.get("button").click();
  cy.get('[data-cy="success-message"]').should("be.visible");
});
```

### 2. Test behavior, không test implementation

```javascript
// ❌ Test implementation
it("Nên call API với đúng parameters", () => {
  // Test chi tiết API call
});

// ✅ Test behavior
it("Nên hiển thị danh sách sản phẩm", () => {
  cy.visit("/products");
  cy.get('[data-cy="product-list"]').should("be.visible");
});
```

## 📚 Tài liệu tham khảo

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Cypress Examples](https://github.com/cypress-io/cypress-example-kitchensink)
