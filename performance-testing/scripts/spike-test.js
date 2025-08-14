import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Load test data from CSV file
const testData = new SharedArray("users", function () {
  return [
    {
      email: "spike1@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User1",
    },
    {
      email: "spike2@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User2",
    },
    {
      email: "spike3@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User3",
    },
    {
      email: "spike4@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User4",
    },
    {
      email: "spike5@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User5",
    },
    {
      email: "spike6@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User6",
    },
    {
      email: "spike7@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User7",
    },
    {
      email: "spike8@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User8",
    },
    {
      email: "spike9@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User9",
    },
    {
      email: "spike10@test.com",
      password: "password123",
      firstName: "Spike",
      lastName: "User10",
    },
  ];
});

// Spike Test Configuration - Shortened
export const options = {
  stages: [
    { duration: "30s", target: 3 }, // Normal load: 3 users for 30s
    { duration: "15s", target: 20 }, // Sudden spike: 20 users in 15s
    { duration: "1m", target: 20 }, // Maintain spike for 1 minute
    { duration: "15s", target: 3 }, // Drop back to normal: 3 users in 15s
    { duration: "30s", target: 3 }, // Normal load: 3 users for 30s
    { duration: "15s", target: 30 }, // Bigger spike: 30 users in 15s
    { duration: "1m", target: 30 }, // Maintain bigger spike for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<10000"], // 95% of requests should be below 10s (very lenient for spike test)
    http_req_failed: ["rate<0.3"], // Error rate should be less than 30% (very lenient for spike test)
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
    "Home page response time < 10s": (r) => r.timings.duration < 10000,
  });
  sleep(0.2); // Very short sleep to maximize load during spike

  // Step 2: Navigate to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Login page loaded": (r) => r.status === 200,
    "Login page response time < 10s": (r) => r.timings.duration < 10000,
  });
  sleep(0.2);

  // Step 3: Navigate to Registration Page
  response = http.get(`${BASE_URL}/#/auth/register`);
  check(response, {
    "Registration page loaded": (r) => r.status === 200,
    "Registration page response time < 10s": (r) => r.timings.duration < 10000,
  });
  sleep(0.2);

  // Step 4: Register New User
  const registerPayload = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: `${userData.email.split("@")[0]}_spike_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}@test.com`,
    password: userData.password,
    dob: "1990-01-01",
    address: "123 Spike Test Avenue",
    city: "Spike City",
    state: "Spike State",
    country: "US",
    postcode: "98765",
    phone: "5555555555",
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
    "Registration attempted": (r) => r.status >= 200 && r.status < 600, // Accept any HTTP response
    "Registration response time < 15s": (r) => r.timings.duration < 15000,
  });

  sleep(0.5);

  // Step 5: Go back to Login Page
  response = http.get(`${BASE_URL}/#/auth/login`);
  check(response, {
    "Return to login page": (r) => r.status === 200,
  });
  sleep(0.2);

  // Step 6: Attempt Login
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
    "Login attempted": (r) => r.status >= 200 && r.status < 600, // Accept any HTTP response
    "Login response time < 15s": (r) => r.timings.duration < 15000,
  });

  sleep(0.5);

  // Additional spike load: Rapid fire requests
  for (let i = 0; i < 5; i++) {
    http.get(`${BASE_URL}/#/`);
    sleep(0.05); // Very short sleep between requests
  }
}
