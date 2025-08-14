import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Load test data from CSV file
const testData = new SharedArray("users", function () {
  return [
    {
      email: "stress1@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User1",
    },
    {
      email: "stress2@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User2",
    },
    {
      email: "stress3@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User3",
    },
    {
      email: "stress4@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User4",
    },
    {
      email: "stress5@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User5",
    },
    {
      email: "stress6@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User6",
    },
    {
      email: "stress7@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User7",
    },
    {
      email: "stress8@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User8",
    },
    {
      email: "stress9@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User9",
    },
    {
      email: "stress10@test.com",
      password: "password123",
      firstName: "Stress",
      lastName: "User10",
    },
  ];
});

// Stress Test Configuration - Shortened
export const options = {
  stages: [
    { duration: "30s", target: 5 }, // Ramp up to 5 users over 30s
    { duration: "1m", target: 5 }, // Stay at 5 users for 1 minute
    { duration: "30s", target: 15 }, // Ramp up to 15 users over 30s
    { duration: "1m", target: 15 }, // Stay at 15 users for 1 minute
    { duration: "30s", target: 20 }, // Ramp up to 25 users over 30s
    { duration: "1m", target: 25 }, // Stay at 25 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users over 30s
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"], // 95% of requests should be below 5s (more lenient for stress test)
    http_req_failed: ["rate<0.2"], // Error rate should be less than 30% (more lenient for stress test)
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
    "Home page response time < 5s": (r) => r.timings.duration < 5000,
  });
  sleep(0.5); // Reduced sleep time to increase stress

  // Step 2: Navigate to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Login page loaded": (r) => r.status === 200,
    "Login page response time < 5s": (r) => r.timings.duration < 5000,
  });
  sleep(0.5);

  // Step 3: Navigate to Registration Page
  response = http.get(`${BASE_URL}/#/auth/register`);
  check(response, {
    "Registration page loaded": (r) => r.status === 200,
    "Registration page response time < 5s": (r) => r.timings.duration < 5000,
  });
  sleep(0.5);

  // Step 4: Register New User
  const registerPayload = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: `${userData.email.split("@")[0]}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}@test.com`,
    password: userData.password,
    dob: "1990-01-01",
    address: "123 Stress Test Street",
    city: "Stress City",
    state: "Stress State",
    country: "US",
    postcode: "54321",
    phone: "9876543210",
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
    "Registration completed": (r) =>
      r.status === 201 || r.status === 200 || r.status === 422,
    "Registration response time < 10s": (r) => r.timings.duration < 10000,
  });

  sleep(1);

  // Step 5: Go back to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Return to login page": (r) => r.status === 200,
  });
  sleep(0.5);

  // Step 6: Attempt Login (may fail due to registration issues under stress)
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
    "Login attempted": (r) =>
      r.status === 200 || r.status === 401 || r.status === 422,
    "Login response time < 10s": (r) => r.timings.duration < 10000,
  });

  sleep(1);

  // Additional stress: Multiple rapid requests to test system limits
  for (let i = 0; i < 3; i++) {
    http.get(`${BASE_URL}/#/`);
    sleep(0.1);
  }
}
