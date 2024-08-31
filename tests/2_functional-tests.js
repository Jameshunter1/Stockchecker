const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path based on where your server file is located

chai.use(chaiHttp);
const expect = chai.expect;

describe('Functional Tests', () => {
  
  const stockId1 = 'AAPL'; // Example stock ID
  const stockId2 = 'GOOGL'; // Example stock ID

  it('Viewing one stock: GET request to /api/stock-prices/', (done) => {
    chai.request(app)     
    .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: stockId1 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.have.property('stock', stockId1);
        expect(res.body.stockData).to.have.property('price');
        expect(res.body.stockData).to.have.property('likes');
        done();
      });
  });

  it('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
    chai.request(app)     

      .get('/api/stock-prices')
      .query({ stock: stockId1, like: 'true' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.have.property('stock', stockId1);
        expect(res.body.stockData).to.have.property('price');
        expect(res.body.stockData.likes).to.be.above(0); // Check if likes increased
        done();
      });
  });

it('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
  // First, view the stock and like it
  chai.request(app)      

    .get('/api/stock-prices')
    .query({ stock: stockId1, like: 'true' })
    .end((err, res) => {
      if (err) return done(err);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('stockData');
      expect(res.body.stockData).to.have.property('stock', stockId1);
      expect(res.body.stockData).to.have.property('price');
      expect(res.body.stockData.likes).to.be.above(0); // Check if likes are present
      
      // Check again after liking it again
      chai.request(app)     

        .get('/api/stock-prices')
        .query({ stock: stockId1, like: 'true' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('stockData');
          expect(res.body.stockData).to.have.property('stock', stockId1);
          expect(res.body.stockData).to.have.property('price');
          expect(res.body.stockData.likes).to.be.above(1); // Check if likes increased

          done();
        });
    });
});

  

  it('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
    chai.request(app)     

      .get('/api/stock-prices')
      .query({ stock: [stockId1, stockId2] })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData').with.lengthOf(2); // Ensure two stocks are returned
        const [stock1, stock2] = res.body.stockData;
        expect(stock1).to.have.property('stock', stockId1);
        expect(stock2).to.have.property('stock', stockId2);
        expect(stock1).to.have.property('price');
        expect(stock2).to.have.property('price');
        expect(stock1).to.have.property('likes');
        expect(stock2).to.have.property('likes');
        done();
      });
  });

  it('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
    chai.request(app)      

      .get('/api/stock-prices')
      .query({ stock: [stockId1, stockId2], like: 'true' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData').with.lengthOf(2); // Ensure two stocks are returned
        const [stock1, stock2] = res.body.stockData;
        expect(stock1.likes).to.be.above(0); // Ensure stockId1 has likes
        expect(stock2.likes).to.be.above(0); // Ensure stockId2 has likes
        done();
      });
  });

});
