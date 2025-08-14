import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Load test data from CSV file
const testData = new SharedArray("users", function () {
  return [
    {
      email: "user1@test.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    },
    {
      email: "user2@test.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Smith",
    },
    {
      email: "user3@test.com",
      password: "password123",
      firstName: "Bob",
      lastName: "Johnson",
    },
    {
      email: "user4@test.com",
      password: "password123",
      firstName: "Alice",
      lastName: "Brown",
    },
    {
      email: "user5@test.com",
      password: "password123",
      firstName: "Charlie",
      lastName: "Wilson",
    },
    {
      email: "user6@test.com",
      password: "password123",
      firstName: "Diana",
      lastName: "Davis",
    },
    {
      email: "user7@test.com",
      password: "password123",
      firstName: "Eve",
      lastName: "Miller",
    },
    {
      email: "user8@test.com",
      password: "password123",
      firstName: "Frank",
      lastName: "Garcia",
    },
    {
      email: "user9@test.com",
      password: "password123",
      firstName: "Grace",
      lastName: "Martinez",
    },
    {
      email: "user10@test.com",
      password: "password123",
      firstName: "Henry",
      lastName: "Anderson",
    },
  ];
});

// Load Test Configuration
export const options = {
  stages: [
    { duration: "30s", target: 3 }, // Ramp up to 3 users over 30s
    { duration: "1m", target: 3 }, // Stay at 3 users for 1 minute
    { duration: "30s", target: 6 }, // Ramp up to 6 users over 30s
    { duration: "1m", target: 6 }, // Stay at 6 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users over 30s
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"], // 95% of requests should be below 3s
    http_req_failed: ["rate<0.1"], // Error rate should be less than 10%
  },
};

const BASE_URL = "http://localhost:4200";
const API_URL = "http://localhost:8091";

export default function () {
  const userData = testData[Math.floor(Math.random() * testData.length)];

  // Step 1: Visit Home Page
  let response = http.get(`${BASE_URL}/#/`);
  check(response, {
    "Home page loaded": (r) => r.status === 200,
    "Home page response time < 2s": (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Step 2: Navigate to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Login page loaded": (r) => r.status === 200,
    "Login page response time < 2s": (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Step 3: Navigate to Registration Page
  response = http.get(`${BASE_URL}/#/auth/register`);
  check(response, {
    "Registration page loaded": (r) => r.status === 200,
    "Registration page response time < 2s": (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Step 4: Register New User
  const registerPayload = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: `${userData.email.split("@")[0]}_${Date.now()}@test.com`,
    password: userData.password,
    dob: "1990-01-01",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    country: "US",
    postcode: "12345",
    phone: "1234567890",
  };

  response = http.post(
    `${API_URL}/users/register`,
    JSON.stringify(registerPayload),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: "http://localhost:4200",
        Referer: "http://localhost:4200/",
      },
    }
  );

  check(response, {
    "Registration successful": (r) => r.status === 201 || r.status === 200,
    "Registration response time < 3s": (r) => r.timings.duration < 3000,
  });

  if (response.status !== 201 && response.status !== 200) {
    console.log(`Registration failed: ${response.status} - ${response.body}`);
  }

  sleep(2);

  // Step 5: Go back to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Return to login page": (r) => r.status === 200,
  });
  sleep(1);

  // Step 6: Login with registered user
  const loginPayload = {
    email: registerPayload.email,
    password: registerPayload.password,
  };

  response = http.post(`${API_URL}/users/login`, JSON.stringify(loginPayload), {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      Origin: "http://localhost:4200",
      Referer: "http://localhost:4200/",
    },
  });

  check(response, {
    "Login successful": (r) => r.status === 200,
    "Login response time < 2s": (r) => r.timings.duration < 2000,
    "Login returns token": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.access_token !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  if (response.status !== 200) {
    console.log(`Login failed: ${response.status} - ${response.body}`);
  }

  sleep(2);
}
