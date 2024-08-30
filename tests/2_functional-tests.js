// tests/2_functional-tests.js
const request = require('supertest');
const app = require('../app'); // Import your app or server file

describe('Functional Tests', () => {
  
  let stockId1 = 'AAPL'; // Example stock ID
  let stockId2 = 'GOOGL'; // Example stock ID

  test('Viewing one stock: GET request to /api/stock-prices/', async () => {
    const response = await request(app).get(`/api/stock-prices/${stockId1}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('stockId', stockId1);
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('likes');
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', async () => {
    const response = await request(app).get(`/api/stock-prices/${stockId1}?like=true`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('stockId', stockId1);
    expect(response.body).toHaveProperty('price');
    expect(response.body.likes).toBeGreaterThan(0); // Check if likes increased
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', async () => {
    const response = await request(app).get(`/api/stock-prices/${stockId1}?like=true`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('stockId', stockId1);
    expect(response.body).toHaveProperty('price');
    expect(response.body.likes).toBeGreaterThan(1); // Check if likes increased again
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', async () => {
    const response = await request(app).get(`/api/stock-prices/?stockIds=${stockId1},${stockId2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); // Ensure two stocks are returned
    expect(response.body[0]).toHaveProperty('stockId', stockId1);
    expect(response.body[1]).toHaveProperty('stockId', stockId2);
    expect(response.body[0]).toHaveProperty('price');
    expect(response.body[1]).toHaveProperty('price');
    expect(response.body[0]).toHaveProperty('likes');
    expect(response.body[1]).toHaveProperty('likes');
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', async () => {
    let response = await request(app).get(`/api/stock-prices/${stockId1}?like=true`);
    expect(response.status).toBe(200);
    expect(response.body.likes).toBeGreaterThan(0);

    response = await request(app).get(`/api/stock-prices/${stockId2}?like=true`);
    expect(response.status).toBe(200);
    expect(response.body.likes).toBeGreaterThan(0);

    response = await request(app).get(`/api/stock-prices/?stockIds=${stockId1},${stockId2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    const stock1 = response.body.find(stock => stock.stockId === stockId1);
    const stock2 = response.body.find(stock => stock.stockId === stockId2);
    expect(stock1.likes).toBeGreaterThan(0);
    expect(stock2.likes).toBeGreaterThan(0);
  });

});
