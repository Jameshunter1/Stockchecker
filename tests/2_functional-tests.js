var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

	var likes;
	var rel_likes;

	suite('GET /api/stock-prices => stockData object', function () {

		test('1 stock', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog' })
				.end(function (err, res) {
					assert.equal(res.status, 200, 'Response status should be 200');
					assert.property(res.body.stockData, 'stock', 'Response should contain stockData with stock');
					assert.property(res.body.stockData, 'price', 'Response should contain stockData with price');
					assert.property(res.body.stockData, 'likes', 'Response should contain stockData with likes');
					assert.equal(res.body.stockData.stock, 'GOOG', 'Stock symbol should be GOOG');
					done();
				});
		});

		test('1 stock with like', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', like: true })
				.end(function (err, res) {
					assert.equal(res.status, 200, 'Response status should be 200');
					assert.property(res.body.stockData, 'stock', 'Response should contain stockData with stock');
					assert.property(res.body.stockData, 'price', 'Response should contain stockData with price');
					assert.property(res.body.stockData, 'likes', 'Response should contain stockData with likes');
					assert.equal(res.body.stockData.stock, 'GOOG', 'Stock symbol should be GOOG');
					assert.isAbove(res.body.stockData.likes, 0, 'Likes should be above 0');
					likes = res.body.stockData.likes; // Store likes for comparison in the next test
					done();
				});
		});

		test('1 stock with like again (ensure likes aren\'t double counted)', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', like: true })
				.end(function (err, res) {
					assert.equal(res.status, 200, 'Response status should be 200');
					assert.property(res.body.stockData, 'stock', 'Response should contain stockData with stock');
					assert.property(res.body.stockData, 'price', 'Response should contain stockData with price');
					assert.property(res.body.stockData, 'likes', 'Response should contain stockData with likes');
					assert.equal(res.body.stockData.stock, 'GOOG', 'Stock symbol should be GOOG');
					done();
				});
		});

		test('2 stocks', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: ['goog', 'msft'] })
				.end(function (err, res) {
					assert.equal(res.status, 200, 'Response status should be 200');
					assert.isArray(res.body.stockData, 'Response should contain an array of stockData');
					assert.property(res.body.stockData[0], 'stock', 'First stockData should contain stock');
					assert.property(res.body.stockData[0], 'price', 'First stockData should contain price');
					assert.property(res.body.stockData[0], 'rel_likes', 'First stockData should contain rel_likes');
					assert.property(res.body.stockData[1], 'stock', 'Second stockData should contain stock');
					assert.property(res.body.stockData[1], 'price', 'Second stockData should contain price');
					assert.property(res.body.stockData[1], 'rel_likes', 'Second stockData should contain rel_likes');
					assert.equal(res.body.stockData[0].stock, 'GOOG', 'First stock symbol should be GOOG');
					assert.equal(res.body.stockData[1].stock, 'MSFT', 'Second stock symbol should be MSFT');
					assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0, 'Relative likes should be zero');
					rel_likes = Math.abs(res.body.stockData[0].rel_likes); // Store for comparison in the next test
					done();
				});
		});

		test('2 stocks with like', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: ['goog', 'msft'], like: true })
				.end(function (err, res) {
					assert.equal(res.status, 200, 'Response status should be 200');
					assert.isArray(res.body.stockData, 'Response should contain an array of stockData');
					assert.property(res.body.stockData[0], 'stock', 'First stockData should contain stock');
					assert.property(res.body.stockData[0], 'price', 'First stockData should contain price');
					assert.property(res.body.stockData[0], 'rel_likes', 'First stockData should contain rel_likes');
					assert.property(res.body.stockData[1], 'stock', 'Second stockData should contain stock');
					assert.property(res.body.stockData[1], 'price', 'Second stockData should contain price');
					assert.property(res.body.stockData[1], 'rel_likes', 'Second stockData should contain rel_likes');
					assert.equal(res.body.stockData[0].stock, 'GOOG', 'First stock symbol should be GOOG');
					assert.equal(res.body.stockData[1].stock, 'MSFT', 'Second stock symbol should be MSFT');
					assert.equal(res.body.stockData[0].rel_likes, rel_likes, 'Relative likes should match previously stored value');
					assert.equal(res.body.stockData[1].rel_likes, rel_likes, 'Relative likes should match previously stored value');
					done();
				});
		});

	});

});
