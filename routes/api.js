const axios = require('axios');

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const stock = req.query.stock;

      // Check if the stock parameter is provided
      if (!stock) {
        return res.status(400).json({ error: 'Stock symbol is required' });
      }

      try {
        // Fetch the stock data from the proxy API
        const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);

        // Check if the response contains the necessary data
        if (response.data && response.data.symbol && response.data.latestPrice) {
          const stockData = {
            stock: response.data.symbol,  // Stock symbol as a string
            price: response.data.latestPrice,  // Price as a number
            likes: 0  // Likes as a number, initially set to 0 (you can modify this based on your logic)
          };

          return res.json({ stockData });
        } else {
          return res.status(404).json({ error: 'Stock data not found' });
        }

      } catch (error) {
        console.error('Error fetching stock data:', error);
        return res.status(500).json({ error: 'Failed to fetch stock data' });
      }
    });
};
