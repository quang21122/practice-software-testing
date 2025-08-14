// Test Configuration File
export const config = {
  baseUrl: 'http://localhost:4200',
  apiUrl: 'http://localhost:8091/api',
  
  // Test thresholds
  thresholds: {
    load: {
      http_req_duration: ['p(95)<2000'],
      http_req_failed: ['rate<0.1'],
    },
    stress: {
      http_req_duration: ['p(95)<5000'],
      http_req_failed: ['rate<0.2'],
    },
    spike: {
      http_req_duration: ['p(95)<10000'],
      http_req_failed: ['rate<0.3'],
    }
  },
  
  // Test stages
  stages: {
    load: [
      { duration: '2m', target: 10 },
      { duration: '5m', target: 10 },
      { duration: '2m', target: 20 },
      { duration: '5m', target: 20 },
      { duration: '2m', target: 0 },
    ],
    stress: [
      { duration: '2m', target: 20 },
      { duration: '5m', target: 20 },
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 150 },
      { duration: '5m', target: 150 },
      { duration: '5m', target: 0 },
    ],
    spike: [
      { duration: '1m', target: 10 },
      { duration: '30s', target: 200 },
      { duration: '2m', target: 200 },
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 300 },
      { duration: '2m', target: 300 },
      { duration: '1m', target: 0 },
    ]
  },
  
  // Sleep times for different test types
  sleepTimes: {
    load: {
      short: 1,
      medium: 2,
      long: 3
    },
    stress: {
      short: 0.5,
      medium: 1,
      long: 1.5
    },
    spike: {
      short: 0.2,
      medium: 0.5,
      long: 1
    }
  }
};
